import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'drawer',
    title: 'Drawer',
    description: 'Slide-in panel from any edge of the screen.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'Drawer.Root', type: 'compound', required: false, description: 'Root provider that manages open/close state.' },
    { name: 'Drawer.Trigger', type: 'compound', required: false, description: 'Element that opens the drawer.' },
    { name: 'Drawer.Portal', type: 'compound', required: false, description: 'Portals the overlay and content into the document body.' },
    { name: 'Drawer.Overlay', type: 'compound', required: false, description: 'Dimmed backdrop rendered behind the drawer.' },
    { name: 'Drawer.Content', type: 'compound', required: false, description: 'The drawer panel. Accepts a side prop.' },
    { name: 'scrollLock', type: "'style' | 'class'", required: false, description: 'On Drawer.Root. How page scroll is locked while open. `class` adds a class from @nexub/themes/base instead of injecting a <style> tag, so it works under a strict CSP (style-src \'self\'). Default `style`.' },
    { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", required: false, description: 'Edge of the screen from which the drawer slides in.' },
    { name: 'Drawer.Header', type: 'compound', required: false, description: 'Header section of the drawer panel.' },
    { name: 'Drawer.Footer', type: 'compound', required: false, description: 'Footer section of the drawer panel.' },
    { name: 'Drawer.Title', type: 'compound', required: false, description: 'Accessible title for the drawer.' },
    { name: 'Drawer.Description', type: 'compound', required: false, description: 'Supporting description text for the drawer.' },
    { name: 'Drawer.Close', type: 'compound', required: false, description: 'Element that closes the drawer.' },
    { name: 'surface', type: "'solid' | 'glass'", default: "'solid'", required: false, description: 'Glass material on Drawer.Content — see Foundations → Materials.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Bottom sheet',
    },
  ],
};

export default entry;
