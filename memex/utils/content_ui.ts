// @ts-nocheck
import { flushSync } from "react-dom";

export function tryViewTransition<T>(func: (...args:T[]) => void, ...args: T[]) {
    if (document.startViewTransition) {
        document.startViewTransition(() => flushSync(() => {
            func(...args)
        }))
    } else {
        func(...args)
    }
}



export function triggerUnmountUi() {
    browser.tabs.getCurrent()
    .then(t => {
        if (!t?.id) return;
        browser.tabs.sendMessage(t.id, { action: `cui:unmountUi` })
    })
}


export function navigateContentUi(navTo: string) {
    browser.tabs.getCurrent()
    .then(t => {
        if (!t?.id) return;
        browser.tabs.sendMessage(t.id, {action: `cui:navigate`, data: { navTo }})
    })
}