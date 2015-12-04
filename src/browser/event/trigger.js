export default function (event, eventData) {
    console.log('Triggering event: ', event);
    document.dispatchEvent(new CustomEvent(event, {detail: eventData}));
}