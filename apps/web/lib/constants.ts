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
    label: "25 minutes, No break",
    value: 25,
  },
  {
    label: "30 minutes, No break",
    value: 30 * 60,
  },
  {
    label: "35 minutes",
    value: 35 * 60,
  },
  {
    label: "40 minutes",
    value: 40 * 60,
  },
];

export { MEDIASOUP_PARAMS };
