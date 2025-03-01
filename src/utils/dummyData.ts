import { FarmsState, UserFarmsState } from "types/backendTypes"

export const farmsDummy: FarmsState = {
  "TADAWEGLD-e427f1": {
    "token1": "TADA-1e4ac8",
    "token2": "WEGLD-a28c59",
    "feesAPR": "20.21",
    "boostedAPR": "10.05",
    "totalAPR": "30.26",
    "totalStaked": "1888999.22",
    "totalRewards": "1987.28",
    "stakingUsers": 234,
    "lp_token_id": "TADAWEGLD-e427f1",
    "totalRewardsList": [
      {
        token: 'TADAWEGLD-e427f1',
        value: '1200'
      },
      {
        token: 'PRIZEEGLD-e427f1',
        value: '600'
      }
    ]
  },
  "CEGLDXCR-701cd5": {
    "token1": "CEGLD-b22b50",
    "token2": "XCR-010281",
    "feesAPR": "10.51",
    "boostedAPR": "0.00",
    "totalAPR": "10.51",
    "totalStaked": "698334.83",
    "totalRewards": "865.63",
    "stakingUsers": 119,
    "lp_token_id": "CEGLDXCR-701cd5",
    "totalRewardsList": [
      {
        token: 'CEGLDXCR-701cd5',
        value: '800'
      }
    ]
  },
  "XGTXCR-386762": {
    "token1": "XGT-114d26",
    "token2": "XCR-010281",
    "feesAPR": "40.00",
    "boostedAPR": "20.00",
    "totalAPR": "60.00",
    "totalStaked": "3549871.00",
    "totalRewards": "10542.28",
    "stakingUsers": 634,
    "lp_token_id": "XGTXCR-386762",
    "totalRewardsList": [
      {
        token: 'XGTXCR-386762',
        value: '2100'
      },
      {
        token: 'PRIZEEGLD-e427f1',
        value: '1540'
      }
    ]
  },
  "WTAOWEGLD-5833e2": {
    "token1": "WTAO-a0cc6b",
    "token2": "WEGLD-a28c59",
    "feesAPR": "5.15",
    "boostedAPR": "0.75",
    "totalAPR": "5.90",
    "totalStaked": "98754.31",
    "totalRewards": "79.98",
    "stakingUsers": 27,
    "lp_token_id": "WTAOWEGLD-5833e2",
    "totalRewardsList": [
      {
        token: 'WTAOWEGLD-5833e2',
        value: '150'
      },
      {
        token: 'PRIZEEGLD-e427f1',
        value: '80'
      }
    ]
  }
};

export const userFarmsDummy: UserFarmsState = {
  "TADAWEGLD-e427f1": {
    staked: "18889.22",
    rewards: "19.28",
    rewardsList: [
      { token: "TADAWEGLD-e427f1", value: "120" },
      { token: "PRIZEEGLD-e427f1", value: "60" },
    ],
  },
  "CEGLDXCR-701cd5": {
    staked: "6983.83",
    rewards: "8.63",
    rewardsList: [
      { token: "CEGLDXCR-701cd5", value: "80" }
    ],
  },
  "XGTXCR-386762": {
    staked: "35498.00",
    rewards: "105.28",
    rewardsList: [
      { token: "XGTXCR-386762", value: "210" },
      { token: "PRIZEEGLD-e427f1", value: "154" },
    ],
  },
  "WTAOWEGLD-5833e2": {
    staked: "987.31",
    rewards: "0.98",
    rewardsList: [
      { token: "WTAOWEGLD-5833e2", value: "15" },
      { token: "PRIZEEGLD-e427f1", value: "0.8" },
    ],
  },
};
