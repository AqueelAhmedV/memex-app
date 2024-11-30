import { tryViewTransition } from "@/utils/content_ui";


export default defineContentScript({
  matches: ['<all_urls>'],
  main(ctx) {
    console.log('Hello content.');
    const navbarUi = createIframeUi(ctx, {
      page: 'navbar.html',
      position: 'overlay',
      onMount(wrapper, iframe) {
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.position = 'fixed';
        wrapper.style.top = '0px';
        wrapper.style.left = '0px';
        wrapper.style.zIndex = '9999';
        // wrapper.style.mixBlendMode = "luminosity"
        // wrapper.style.backdropFilter = "blur(10px)"
        // wrapper.style.scrollbarWidth = 'none'
        wrapper.style.overflow = 'hidden'

        iframe.width = '100%'
        iframe.height = '100%'
        iframe.frameBorder = "none"
        iframe.style.overflow = 'hidden'
        iframe.autofocus = true
        wrapper.style.overflow = 'hidden'
        // iframe.style.scrollbarWidth = 'none'
        console.log("mounted")
      },
    })


    navbarUi.mount()
    

    const ui = createIframeUi(ctx, {
      page: 'document_form.html',
      position: 'inline',
      onMount(wrapper, iframe) {
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.position = 'fixed';
        wrapper.style.top = '0px';
        wrapper.style.left = '0px';
        wrapper.style.zIndex = '9999';
        // wrapper.style.mixBlendMode = "luminosity"
        // wrapper.style.backdropFilter = "blur(10px)"
        // wrapper.style.scrollbarWidth = 'none'
        wrapper.style.overflow = 'hidden'

        iframe.width = '100%'
        iframe.height = '100%'
        iframe.frameBorder = "none"
        iframe.style.overflow = 'hidden'
        iframe.autofocus = true
        wrapper.style.overflow = 'hidden'
        // iframe.style.scrollbarWidth = 'none'
        console.log("mounted")
        
      },
      // append(anchor, ui) {
        
      // },
    })

    browser.runtime.onMessage.addListener((msg) => {
      if (!('action' in msg)) return;
      console.log("RECEIVED", msg)
      if (msg.action === 'cui:openSearch') ui.mount();
      else if (msg.action === 'cui:unmountUi') {
        ui.remove()
      } else if (msg.action === 'cui:navigate') {
        
        tryViewTransition((navTo) => {
          
          ui.iframe.src = browser.runtime.getURL(navTo)
          if (!ui.mounted) ui.mount()
        }, msg.data.navTo)
      } else if (msg.action === 'cui:openNavbar') {
        navbarUi.mount()
      } else if (msg.action === 'cui:closeNavbar') {
        navbarUi.remove()
      }

    })
  },
});
