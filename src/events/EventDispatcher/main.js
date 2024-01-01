import EventDispacher from "./EventDispacher.js";


let eventDispacher = EventDispacher;
let event1 = new Event("event1", "data1");
let event2 = new Event("event2", "data2");
let publisher1 =  new publisher(event1);
let publisher2 =  new publisher(event2);
let subscriber1 = new subscriber("subscriber1");
let subscriber2 = new subscriber("subscriber2");


// making the variables global for debugging
window.eventDispacher = eventDispacher;
window.event1 = event1;
window.event2 = event2;
window.publisher1 = publisher1;
window.publisher2 = publisher2;
window.subscriber1 = subscriber1;
window.subscriber2 = subscriber2;

subscriber1.eventDispatcher.subscribe("event1", subscriber1);

subscriber2.eventDispatcher.subscribe("event2", subscriber2);
subscriber2.eventDispatcher.subscribe("event1", subscriber2);
publisher1.eventDispatcher.publishEvent(event2);
publisher1.eventDispatcher.publishEvent(event1);
let e = "Event Dispatcher";
window.e = e
console.log(e);

