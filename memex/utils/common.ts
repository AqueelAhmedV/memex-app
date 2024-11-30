export function sleep(s: number) {
    return new Promise((r) => {
        setTimeout(() => {
            r(s);
        }, s*1000)
    })
}