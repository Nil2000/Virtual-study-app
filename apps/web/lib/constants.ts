const MEDIASOUP_PARAMS = {
  encodings: [
    {
      rid: "r0",
      maxBitrate: 100000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r1",
      maxBitrate: 300000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r2",
      maxBitrate: 900000,
      scalabilityMode: "S1T3",
    },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};
const Pomodoro_time_options = [
  {
    label: "1 Hour: 25 + 5 mins × 2",
    value: "1:25:5",
  },
  {
    label: "1.5 Hours: 25 + 5 mins × 3",
    value: "1.5:25:5",
  },
  {
    label: "2 Hours: 25 + 5 mins × 4",
    value: "2:25:5",
  },
  {
    label: "2 Hours: 50 + 10 mins × 2",
    value: "2:50:10",
  },
  {
    label: "2.5 Hours: 25 + 5 mins × 5",
    value: "2.5:25:5",
  },
  {
    label: "3 Hours: 25 + 5 mins × 6",
    value: "3:25:5",
  },
  {
    label: "3 Hours: 50 + 10 mins × 3",
    value: "3:50:10",
  },
  {
    label: "4 Hours: 25 + 5 mins × 8",
    value: "4:25:5",
  },
  {
    label: "4 Hours: 50 + 10 mins × 4",
    value: "4:50:10",
  },
];

export { MEDIASOUP_PARAMS, Pomodoro_time_options };
