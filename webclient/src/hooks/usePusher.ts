import { useEffect, useState } from "react";
import { useScript } from "usehooks-ts";

declare const Pusher: any;

export const usePusher = () => {
  const [channel, setChannel] = useState();

  const status = useScript(`https://js.pusher.com/8.2.0/pusher.min.js`, {
    removeOnUnmount: false,
  });

  useEffect(() => {
    if (typeof Pusher !== "undefined") {
      Pusher.logToConsole = true;
      var pusher = new Pusher();

      setChannel(pusher.subscribe("my-channel"));
    }
  }, [status]);

  return { channel };
};
