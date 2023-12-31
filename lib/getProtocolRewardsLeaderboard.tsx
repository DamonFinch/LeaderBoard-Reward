import { getRewardsDepositEvents } from "./getRewardsDepositEvents"

const getProtocolRewardsLeaderboard = async (chainId, numberOfDays) => {
  const data = await getRewardsDepositEvents(chainId, numberOfDays)
  const groupedData = data.reduce((acc, curr) => {
    if (!acc[curr.creator]) {
      acc[curr.creator] = BigInt(0)
    }
    acc[curr.creator] += BigInt(curr.creatorReward)

    if (curr.createReferral === curr.creator) {
      acc[curr.creator] += BigInt(curr.createReferralReward)
    }
    if (curr.firstMinter === curr.creator) {
      acc[curr.creator] += BigInt(curr.firstMinterReward)
    }
    if (curr.mintReferral === curr.creator) {
      acc[curr.creator] += BigInt(curr.mintReferralReward)
    }
    return acc
  }, {})

  const results = Object.entries(groupedData)
    .map(([creator, totalCreatorReward]) => ({
      creator,
      totalCreatorReward: totalCreatorReward.toString(),
    }))
    .sort((a, b) => {
      if (BigInt(a.totalCreatorReward) < BigInt(b.totalCreatorReward)) {
        return 1 // a comes after b
      }
      if (BigInt(a.totalCreatorReward) > BigInt(b.totalCreatorReward)) {
        return -1 // a comes before b
      }
      return 0 // a and b are equal
    })

  return results
}

export default getProtocolRewardsLeaderboard
