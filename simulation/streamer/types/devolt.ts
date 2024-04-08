export type Devolt = {
    "version": "0.1.0",
    "name": "devolt",
    "instructions": [
      {
        "name": "retrieveStation",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "station",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "batteryReport",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "station",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "args",
            "type": {
              "defined": "CreateBateryReportArgs"
            }
          }
        ]
      },
      {
        "name": "placeBid",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "station",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "args",
            "type": {
              "defined": "PlaceBidArgs"
            }
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "station",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "auth",
              "type": "publicKey"
            },
            {
              "name": "id",
              "type": "string"
            },
            {
              "name": "latitude",
              "type": "f64"
            },
            {
              "name": "longitude",
              "type": "f64"
            },
            {
              "name": "maxCapacity",
              "type": "f64"
            },
            {
              "name": "batteryLevel",
              "type": "f64"
            },
            {
              "name": "auction",
              "type": {
                "option": {
                  "defined": "Auction"
                }
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "Bid",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bidder",
              "type": "string"
            },
            {
              "name": "amount",
              "type": "f64"
            },
            {
              "name": "pricePerAmount",
              "type": "f64"
            }
          ]
        }
      },
      {
        "name": "Auction",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "reqCharge",
              "type": "f64"
            },
            {
              "name": "timestamp",
              "type": "u64"
            },
            {
              "name": "bids",
              "type": {
                "vec": {
                  "defined": "Bid"
                }
              }
            },
            {
              "name": "ongoing",
              "type": "bool"
            },
            {
              "name": "winningBids",
              "type": {
                "vec": {
                  "defined": "Bid"
                }
              }
            }
          ]
        }
      },
      {
        "name": "CreateBateryReportArgs",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "id",
              "type": "string"
            },
            {
              "name": "latitude",
              "type": "f64"
            },
            {
              "name": "longitude",
              "type": "f64"
            },
            {
              "name": "maxCapacity",
              "type": "f64"
            },
            {
              "name": "batteryLevel",
              "type": "f64"
            }
          ]
        }
      },
      {
        "name": "PlaceBidArgs",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "id",
              "type": "string"
            },
            {
              "name": "bidder",
              "type": "string"
            },
            {
              "name": "amount",
              "type": "f64"
            },
            {
              "name": "pricePerAmount",
              "type": "f64"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "UnauthorizedToDeleteProject",
        "msg": "Unauthorized to delete the project"
      },
      {
        "code": 6001,
        "name": "InvalidShadowAccount",
        "msg": "Invalid shadow account"
      },
      {
        "code": 6002,
        "name": "InvalidAccount",
        "msg": "Invalid account"
      },
      {
        "code": 6003,
        "name": "Unauthorized",
        "msg": "Unauthorized access"
      }
    ]
  };
  
  export const IDL: Devolt = {
    "version": "0.1.0",
    "name": "devolt",
    "instructions": [
      {
        "name": "retrieveStation",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "station",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "batteryReport",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "station",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "args",
            "type": {
              "defined": "CreateBateryReportArgs"
            }
          }
        ]
      },
      {
        "name": "placeBid",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "station",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "args",
            "type": {
              "defined": "PlaceBidArgs"
            }
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "station",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "auth",
              "type": "publicKey"
            },
            {
              "name": "id",
              "type": "string"
            },
            {
              "name": "latitude",
              "type": "f64"
            },
            {
              "name": "longitude",
              "type": "f64"
            },
            {
              "name": "maxCapacity",
              "type": "f64"
            },
            {
              "name": "batteryLevel",
              "type": "f64"
            },
            {
              "name": "auction",
              "type": {
                "option": {
                  "defined": "Auction"
                }
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "Bid",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bidder",
              "type": "string"
            },
            {
              "name": "amount",
              "type": "f64"
            },
            {
              "name": "pricePerAmount",
              "type": "f64"
            }
          ]
        }
      },
      {
        "name": "Auction",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "reqCharge",
              "type": "f64"
            },
            {
              "name": "timestamp",
              "type": "u64"
            },
            {
              "name": "bids",
              "type": {
                "vec": {
                  "defined": "Bid"
                }
              }
            },
            {
              "name": "ongoing",
              "type": "bool"
            },
            {
              "name": "winningBids",
              "type": {
                "vec": {
                  "defined": "Bid"
                }
              }
            }
          ]
        }
      },
      {
        "name": "CreateBateryReportArgs",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "id",
              "type": "string"
            },
            {
              "name": "latitude",
              "type": "f64"
            },
            {
              "name": "longitude",
              "type": "f64"
            },
            {
              "name": "maxCapacity",
              "type": "f64"
            },
            {
              "name": "batteryLevel",
              "type": "f64"
            }
          ]
        }
      },
      {
        "name": "PlaceBidArgs",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "id",
              "type": "string"
            },
            {
              "name": "bidder",
              "type": "string"
            },
            {
              "name": "amount",
              "type": "f64"
            },
            {
              "name": "pricePerAmount",
              "type": "f64"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "UnauthorizedToDeleteProject",
        "msg": "Unauthorized to delete the project"
      },
      {
        "code": 6001,
        "name": "InvalidShadowAccount",
        "msg": "Invalid shadow account"
      },
      {
        "code": 6002,
        "name": "InvalidAccount",
        "msg": "Invalid account"
      },
      {
        "code": 6003,
        "name": "Unauthorized",
        "msg": "Unauthorized access"
      }
    ]
  };
  