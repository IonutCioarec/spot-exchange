import { FarmState, UserFarmsState } from "types/backendTypes"

export const farmsDummy: FarmState = {
  "TADAWEGLD-e427f1": {
    "farm_address": 'erd...',
    "token1": "TADA-1e4ac8",
    "token2": "WEGLD-a28c59",
    "fees_apr": "20.21",
    "boosted_apr": "10.05",
    "total_apr": "30.26",
    "total_staked": "1888999.22",
    "total_rewards": "1987.28",
    "staking_users": 234,
    "lp_token_id": "TADAWEGLD-e427f1",
    "total_rewards_list": [
      {
        token: 'TADAWEGLD-e427f1',
        amount: 1200,
        value: '1200'
      },
      {
        token: 'PRIZEEGLD-e427f1',
        amount: 1200,
        value: '600'
      }
    ]
  },
  "CEGLDXCR-701cd5": {
    "farm_address": 'erd...',
    "token1": "CEGLD-b22b50",
    "token2": "XCR-010281",
    "fees_apr": "10.51",
    "boosted_apr": "0.00",
    "total_apr": "10.51",
    "total_staked": "698334.83",
    "total_rewards": "865.63",
    "staking_users": 119,
    "lp_token_id": "CEGLDXCR-701cd5",
    "total_rewards_list": [
      {
        token: 'CEGLDXCR-701cd5',
        amount: 1200,
        value: '800'
      }
    ]
  },
  "XGTXCR-386762": {
    "farm_address": 'erd...',
    "token1": "XGT-114d26",
    "token2": "XCR-010281",
    "fees_apr": "40.00",
    "boosted_apr": "20.00",
    "total_apr": "60.00",
    "total_staked": "3549871.00",
    "total_rewards": "10542.28",
    "staking_users": 634,
    "lp_token_id": "XGTXCR-386762",
    "total_rewards_list": [
      {
        token: 'XGTXCR-386762',
        amount: 1200,
        value: '2100'
      },
      {
        token: 'PRIZEEGLD-e427f1',
        amount: 1200,
        value: '1540'
      }
    ]
  },
  "WTAOWEGLD-5833e2": {
    "farm_address": 'erd...',
    "token1": "WTAO-a0cc6b",
    "token2": "WEGLD-a28c59",
    "fees_apr": "5.15",
    "boosted_apr": "0.75",
    "total_apr": "5.90",
    "total_staked": "98754.31",
    "total_rewards": "79.98",
    "staking_users": 27,
    "lp_token_id": "WTAOWEGLD-5833e2",
    "total_rewards_list": [
      {
        token: 'WTAOWEGLD-5833e2',
        amount: 1200,
        value: '150'
      },
      {
        token: 'PRIZEEGLD-e427f1',
        amount: 1200,
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
