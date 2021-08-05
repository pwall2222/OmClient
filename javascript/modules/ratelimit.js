let rateLimited = false;
const rateLimit = () => {
    rateLimited = true;
    setTimeout(() => {
        rateLimited = false;
    }, 750);
};
export { rateLimit, rateLimited };

//# sourceMappingURL=ratelimit.js.map
