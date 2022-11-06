self.addEventListener("push", (event) => {
  let res2 = event.data.json();
  //   console.log(res2.msg);
  //   console.log(res2.body);
  var options = {
    body: res2.body,
    icon: "images/example.png",
    vibrate: [100, 50, 100],
    data: { primaryKey: 1 },
  };

  event.waitUntil(self.registration.showNotification(res2.msg, options));
});
