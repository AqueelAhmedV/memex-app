import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    web_accessible_resources: [
      {
        resources: [
          'search_bar.html', 
          'document_form.html', 
          'navbar.html',
          'configure.html'
        ],
        matches: ['<all_urls>'],
      },
    ],
    commands: {
      openSearch: {
        suggested_key: {
          default: 'Ctrl+M'
        },
        description: 'Ctrl+M'
      },
      closeSearch: {
        suggested_key: {
          default: 'Ctrl+B'
        },
        description: 'Ctrl+B'
      },
      openNavbar: {
        suggested_key: {
          default: 'Alt+N'
        },
        description: 'Alt+N'
      }
    },
  }
});
