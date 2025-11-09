import { FoodItem } from './CartContext';

export const DINING_HALLS = [
  'Worcester',
  'Hampshire',
  'Berkshire',
  'Franklin',
  'All'
];

export const FOOD_TAGS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'American',
  'Italian',
  'Asian',
  'Mexican',
  'Healthy',
  'Comfort Food'
];

export const MOCK_FOOD_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    diningHall: 'Worcester',
    tags: ['American', 'Comfort Food'],
    description: 'Juicy beef patty with cheese, lettuce, tomato, and pickles'
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    diningHall: 'Hampshire',
    tags: ['Italian', 'Vegetarian'],
    description: 'Fresh mozzarella, tomatoes, and basil on hand-tossed dough'
  },
  {
    id: '3',
    name: 'Rainbow Buddha Bowl',
    diningHall: 'Berkshire',
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Healthy'],
    description: 'Quinoa, roasted vegetables, chickpeas, and tahini dressing'
  },
  {
    id: '4',
    name: 'California Roll',
    diningHall: 'Franklin',
    tags: ['Asian', 'Healthy'],
    description: 'Crab, avocado, and cucumber wrapped in rice and seaweed'
  },
  {
    id: '5',
    name: 'Penne Alfredo',
    diningHall: 'Worcester',
    tags: ['Italian', 'Vegetarian', 'Comfort Food'],
    description: 'Creamy parmesan sauce over penne pasta'
  },
  {
    id: '6',
    name: 'Turkey Club Sandwich',
    diningHall: 'Hampshire',
    tags: ['American', 'Halal'],
    description: 'Triple-decker with turkey, bacon, lettuce, and tomato'
  },
  {
    id: '7',
    name: 'Veggie Burger',
    diningHall: 'Berkshire',
    tags: ['Vegetarian', 'Vegan', 'Healthy'],
    description: 'Black bean patty with avocado and sprouts'
  },
  {
    id: '8',
    name: 'Chicken Teriyaki Bowl',
    diningHall: 'Franklin',
    tags: ['Asian', 'Gluten-Free', 'Halal'],
    description: 'Grilled chicken with teriyaki sauce over rice and vegetables'
  },
  {
    id: '9',
    name: 'Pepperoni Pizza',
    diningHall: 'Worcester',
    tags: ['Italian', 'American', 'Comfort Food'],
    description: 'Classic pepperoni and cheese pizza'
  },
  {
    id: '10',
    name: 'Greek Salad',
    diningHall: 'Hampshire',
    tags: ['Vegetarian', 'Gluten-Free', 'Healthy'],
    description: 'Fresh greens, feta cheese, olives, and Greek dressing'
  },
  {
    id: '11',
    name: 'Beef Tacos',
    diningHall: 'Berkshire',
    tags: ['Mexican', 'Gluten-Free'],
    description: 'Seasoned beef with fresh toppings in corn tortillas'
  },
  {
    id: '12',
    name: 'Vegetable Stir Fry',
    diningHall: 'Franklin',
    tags: ['Asian', 'Vegan', 'Vegetarian', 'Healthy'],
    description: 'Mixed vegetables in savory sauce over rice'
  }
];
