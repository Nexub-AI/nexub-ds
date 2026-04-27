export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface ExampleDef {
  title: string;
  description?: string;
  code: string;
}

export interface ComponentMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  package: '@nexub/react' | '@nexub/patterns';
  status?: 'stable' | 'beta' | 'deprecated';
  addedIn?: string; // semver e.g. '0.0.1' — shown as "Added in v0.0.1" badge
}

export interface ComponentEntry {
  meta: ComponentMeta;
  props: PropDef[];
  examples: ExampleDef[];
}

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  category?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
  children?: NavGroup[]; // nested sub-sections (e.g. component categories inside "Components")
}
