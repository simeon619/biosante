export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageview = (pixelId?: string) => {
    if (!pixelId) return;
    (window as any).fbq('track', 'PageView');
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name: string, options = {}, pixelId?: string, eventId?: string) => {
    if (!pixelId) return;
    if (eventId) {
        (window as any).fbq('track', name, options, { eventID: eventId });
    } else {
        (window as any).fbq('track', name, options);
    }
};
