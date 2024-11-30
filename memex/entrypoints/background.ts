export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  browser.commands.onCommand.addListener((cmd: string, tab: Record<string, string>) => {
    if (!tab?.id) throw { err: `cmd ${cmd} invoked from invalid context` }
    console.log(cmd, 'received')
    browser.tabs.sendMessage(tab.id, { action: `cui:${cmd}` })
  })
});
