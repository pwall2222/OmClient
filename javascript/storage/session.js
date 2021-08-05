class Session {
    constructor() {
        this.started = false;
        this.connected = false;
        this.video = false;
        this.typing = false;
        this.rtc = {
            call: false,
            peer: false,
            candidates: [],
        };
    }
}
export { Session };

//# sourceMappingURL=session.js.map
