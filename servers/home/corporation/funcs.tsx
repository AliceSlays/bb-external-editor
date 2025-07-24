

export async function main(ns:NS){

    // corp control
    ns.corporation.acceptInvestmentOffer
    ns.corporation.bribe
    ns.corporation.buyBackShares
    ns.corporation.canCreateCorporation
    ns.corporation.createCorporation
    ns.corporation.getInvestmentOffer
    ns.corporation.goPublic
    ns.corporation.hasCorporation
    ns.corporation.issueDividends
    ns.corporation.issueNewShares
    ns.corporation.sellShares

    // upgrades
    ns.corporation.getUnlockCost
    ns.corporation.getUpgradeLevel
    ns.corporation.getUpgradeLevelCost
    ns.corporation.hasUnlock
    ns.corporation.levelUpgrade
    ns.corporation.purchaseUnlock

    // production materials
    ns.corporation.bulkPurchase
    ns.corporation.buyMaterial
    ns.corporation.exportMaterial
    ns.corporation.getMaterial
    ns.corporation.getMaterialData
    ns.corporation.sellMaterial

    // production control 
    ns.corporation.getProduct
    ns.corporation.cancelExportMaterial
    ns.corporation.discontinueProduct
    ns.corporation.getBonusTime
    ns.corporation.sellProduct
    ns.corporation.makeProduct
    ns.corporation.research
    ns.corporation.getResearchCost

    // production setup
    ns.corporation.expandCity
    ns.corporation.expandIndustry
    ns.corporation.sellDivision

    // production storage
    ns.corporation.getWarehouse
    ns.corporation.limitMaterialProduction
    ns.corporation.limitProductProduction
    ns.corporation.purchaseWarehouse
    ns.corporation.getUpgradeWarehouseCost
    ns.corporation.hasWarehouse
    ns.corporation.upgradeWarehouse

        // info
    ns.corporation.getConstants()
    ns.corporation.getDivision('')
    ns.corporation.getIndustryData

    // runtime
    ns.corporation.nextUpdate

    // management
    ns.corporation.buyTea
    ns.corporation.getHireAdVertCost
    ns.corporation.getHireAdVertCount
    ns.corporation.getOffice
    ns.corporation.getOfficeSizeUpgradeCost
    ns.corporation.hasResearched
    ns.corporation.hireAdVert
    ns.corporation.hireEmployee
    ns.corporation.throwParty
    ns.corporation.upgradeOfficeSize

    // smart control
    ns.corporation.setAutoJobAssignment
    ns.corporation.setMaterialMarketTA1
    ns.corporation.setMaterialMarketTA2
    ns.corporation.setProductMarketTA1
    ns.corporation.setProductMarketTA2
    ns.corporation.setSmartSupply
    ns.corporation.setSmartSupplyOption
    
}