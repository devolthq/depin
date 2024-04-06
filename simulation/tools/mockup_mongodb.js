db = db.getSiblingDB('mongodb');

db.createCollection('stations');

db.stations.insertMany([
  {
    "latitude":  -23.562387,
    "longitude": -46.711777,
    "params":    {"min": 0.0, "max": 500.0}
  },
  {
    "latitude":  -23.562347,
    "longitude": -46.711887,
    "params":    {"min": 100.0, "max": 600.0}
  },
  {
    "latitude":  -23.562307,
    "longitude": -46.711997,
    "params":    {"min": 200.0, "max": 700.0}
  },
  {
    "latitude":  -23.562267,
    "longitude": -46.712107,
    "params":    {"min": 300.0, "max": 800.0}
  },
  {
    "latitude":  -23.562227,
    "longitude": -46.712217,
    "params":    {"min": 400.0, "max": 900.0}
  },
  {
    "latitude":  -23.562187,
    "longitude": -46.712327,
    "params":    {"min": 500.0, "max": 1000.0}
  },
  {
    "latitude":  -23.562147,
    "longitude": -46.712437,
    "params":    {"min": 600.0, "max": 1100.0}
  },
  {
    "latitude":  -23.562107,
    "longitude": -46.712547,
    "params":    {"min": 700.0, "max": 1200.0}
  },
  {
    "latitude":  -23.562067,
    "longitude": -46.712657,
    "params":    {"min": 800.0, "max": 1300.0}
  },
  {
    "latitude":  -23.562027,
    "longitude": -46.712767,
    "params":    {"min": 900.0, "max": 1400.0}
  }
]);
