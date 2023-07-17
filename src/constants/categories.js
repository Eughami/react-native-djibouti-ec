export const CategoryEnum = {
  Car: 'Car',
  Motorcycle: 'Motorcycle',
  Boat: 'Boat',
  PartAndAccessory: 'PartAndAccessory',
  HouseSale: 'HouseSale',
  HouseRent: 'HouseRent',
  Land: 'Land',
  CommercialProperty: 'CommercialProperty',
  Job: 'Job',
  Service: 'Service',
  MachineAndEquipment: 'MachineAndEquipment',
  HomeDecor: 'HomeDecor',
  HomeAppliance: 'HomeAppliance',
  AirConditioner: 'AirConditioner',
  Clothe: 'Clothe',
  Accessory: 'Accessory',
  Computer: 'Computer',
  Game: 'Game',
  Mobile: 'Mobile',
  TV: 'TV',
  Sport: 'Sport',
  Book: 'Book',
  Toy: 'Toy',
  Movie: 'Movie',
}

export const HomeCategories = [
  {
    icon: 'car-outline',
    name: CategoryEnum.Car,
  },
  {
    icon: 'game-controller-outline',
    name: CategoryEnum.Game,
  },
  {
    icon: 'phone-portrait-outline',
    name: CategoryEnum.Mobile,
  },
  {
    icon: 'desktop-outline',
    name: CategoryEnum.Computer,
  },
  {
    icon: 'shirt-outline',
    name: CategoryEnum.Clothe,
  },
  {
    icon: 'videocam-outline',
    name: CategoryEnum.Movie,
  },
]

export const NotificationTypeEnum = {
  singleCategory: 'SINGLE_CATEGORY',
  multiCategory: 'MULTI_CATEGORY',
}
