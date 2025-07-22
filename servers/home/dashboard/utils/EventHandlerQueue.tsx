export class EventHandlerQueue {
 
    private queue: (() => void | Promise<unknown>)[] = [];
 
    public wrap<T extends (...args: any[]) => any>(fn: T) {
        return ((...args: Parameters<T>) => {
            if (args[0] && typeof args[0] === 'object' && typeof args[0].persist === 'function') {
                args[0].persist();
            }
            this.queue.push(() => fn(...args));
        });
    }
 
    public async executeEvents() {
        const events = this.queue;
        this.queue = [];
        for await (const event of events) {
            await event();
        }
    }
}