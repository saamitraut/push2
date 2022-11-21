self.addEventListener("push", (event) => {
  let res2 = event.data.json();
  //console.log("http://payment.iccnetwork.net/sla/api/" + res2.uri + ".jpg");
  //   console.log(res2.body);
  var options = {
    body: res2.body,
    icon: "https://extraordinary-selkie-f925b7.netlify.app/images/mozilla-firefox-icon-logo-png-3.png",
    vibrate: [100, 50, 100],
    image: "http://payment.iccnetwork.net/sla/api/" + res2.uri + ".jpg",
    actions: [
      {
        action: "action1",
        title: "Action1",
        // icon: "images/cofee.png",
      },
      {
        action: "action2",
        title: "Action2",
        // icon: "images/cofee.png",
      },
    ],
    data: { primaryKey: 1 },
  };
  event.waitUntil(self.registration.showNotification(res2.msg, options));
});

self.addEventListener("notificationclick", function (event) {
  if (!event.action) {
    // Was a normal notification click
    console.log("Notification Click.");
    return;
  }

  switch (event.action) {
    case "action1":
      console.log("User ❤️️'s coffee.");
      break;
    case "action2":
      console.log("User ❤️️'s doughnuts.");
      break;
    default:
      console.log(`Unknown action clicked: '${event.action}'`);
      break;
  }
});
