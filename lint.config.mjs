const allowedLinkProtocols = new Set([
    "https:",
    "mailto:",
    "tel:",
]);

const allowedAssetProtocols = new Set([
    "https:",
]);

const requiredCspDirectives = [
    "default-src",
    "script-src",
    "style-src",
    "img-src",
    "object-src",
    "base-uri",
    "connect-src",
    "form-action",
];

export default {
    allowedAssetProtocols,
    allowedLinkProtocols,
    disallowEventHandlers: true,
    disallowHttpLinks: true,
    requiredCspDirectives,
    requireCaptchaOnForms: true,
};
