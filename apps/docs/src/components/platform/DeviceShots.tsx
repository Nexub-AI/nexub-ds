import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Text } from '@nexub/react';
import { Section } from '@/components/kit';

// Screenshot baselines recorded by the Mobile workflow (Maestro on an iOS
// simulator and an Android emulator), copied to public/device-shots at build.
const BASELINES = join(process.cwd(), '../mobile/.maestro/baselines');
const PLATFORMS = [
  { id: 'ios', label: 'iPhone (iOS simulator)' },
  { id: 'android', label: 'Pixel (Android emulator)' },
] as const;

/** PNG width and height, read from the IHDR chunk. */
function pngSize(file: string) {
  const b = readFileSync(file);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

/** Screenshot files for a preview path: `preview/button` → button--N--<platform>.png, `preview/pattern/home` → pattern-home--<platform>.png. */
function shotsFor(preview: string, platform: string) {
  const dir = join(BASELINES, platform);
  if (!existsSync(dir)) return [];
  const name = preview.replace(/^preview\//, '');
  const prefix = name.startsWith('pattern/')
    ? `pattern-${name.slice('pattern/'.length)}--`
    : `${name}--`;
  return readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f.endsWith(`--${platform}.png`))
    .sort()
    .map((f) => ({ file: f, ...pngSize(join(dir, f)) }));
}

/** The first example of a native preview as it renders on iOS and Android. */
export function DeviceShots({ preview, title }: { preview: string; title: string }) {
  const shots = PLATFORMS.map((p) => ({ ...p, shot: shotsFor(preview, p.id)[0] })).filter(
    (p) => p.shot,
  );
  if (shots.length === 0) return null;
  return (
    <Section id="on-device" title="On device" level={3}>
      <figure className="m-0 flex flex-col gap-3">
        <div className="flex flex-wrap justify-center gap-6">
          {shots.map(({ id, label, shot }) => (
            <div key={id} className="flex flex-col items-center gap-2">
              {/* Static export: plain img with intrinsic size; next/image adds nothing here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/device-shots/${id}/${shot!.file}`}
                alt={`${title} on ${label}`}
                width={shot!.width}
                height={shot!.height}
                loading="lazy"
                className="h-auto w-[180px] rounded-shape-container border border-[var(--color-outline-variant)] shadow-elevation-1"
              />
              <Text size="caption" tone="muted">
                {label}
              </Text>
            </div>
          ))}
        </div>
        <figcaption>
          <Text size="caption" tone="muted" className="text-center">
            Screenshots from the latest CI run of the showcase app; the live frame renders the same
            code for the web.
          </Text>
        </figcaption>
      </figure>
    </Section>
  );
}
