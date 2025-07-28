import p_img00 from './ochaimg1.png'
import p_img01 from './ochaimg2.png'
import p_img1 from './mooyong.png'
import p_img2 from './kaiyong.png'
import p_img3 from './numjimlukchin.png'
import p_img4 from './numprikmooyong.png'
import p_img5 from './MooyongCarton.png'
import p_img6 from './MooyongCartonAllPork.png'


import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import menu_icon from './menu_icon.png'
import cross_icon from './cross_icon.png'
import logo from './logo.png'
import hero_img from './hero_img.jpg'
import support_img from './support_img.png'
import delivery_img from './delivery.png'

export const assets = {
    cart_icon,
    bin_icon,
    dropdown_icon,
    exchange_icon,
    profile_icon,
    quality_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    menu_icon,
    cross_icon,
    logo,
    hero_img,
    support_img,
    delivery_img
}

export const products = [
  {
    _id: "py01",
    name: "หมูหยองเบเกอรี่ (หมูผสมไก่)",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam inventore est officiis quibusdam deleniti assumenda.",
    price: 170, 
    image: [p_img1, p_img00, p_img01],  
    category: "PorkAndChicken",
    subCategory: "Pack",
    sizes: ["500g","1000g"],
    date: new Date('2024-07-01T10:00:00').getTime(),
    bestseller: true
  },
  {
    _id: "py02",
    name: "โอชา ไก่หยองเบเกอรี่",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam inventore est officiis quibusdam deleniti assumenda.",
    price: 170,
    image: [p_img2, p_img00, p_img01],  
    category: "Chicken",
    subCategory: "Pack",
    sizes: ["1000g"],
    date: new Date('2024-06-15T09:30:00').getTime(),
    bestseller: false
  },
  {
    _id: "py03",
    name: "น้ำจิ้มลูกชิ้น (สูตรมะขาม) แบบขวด",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam inventore est officiis quibusdam deleniti assumenda.",
    price: 25,
    image: [p_img3, p_img00, p_img01],  
    category: "Sauce",
    subCategory: "Bottle",
    sizes: ["220g"],
    date: new Date('2024-05-20T14:00:00').getTime(),
    bestseller: false
  },
  {
    _id: "py04",
    name: "น้ำพริกหมูหยอง",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam inventore est officiis quibusdam deleniti assumenda.",
    price: 140,
    image: [p_img4, p_img00, p_img01],  
    category: "Chili-sauce",
    subCategory: "Jar",
    sizes: ["500g"],
    date: new Date('2024-07-10T08:00:00').getTime(),
    bestseller: true
  },
  {
    _id: "py05",
    name: "หมูหยองเบเกอรี่ (หมูผสมไก่) แบบลัง",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam inventore est officiis quibusdam deleniti assumenda.",
    price: 4000,
    image: [p_img5, p_img00, p_img01],  
    category: "PorkAndChicken",
    subCategory: "Carton",
    sizes: ["26.2kg"],
    date: new Date('2024-07-10T08:00:00').getTime(),
    bestseller: true
  },
  {
    _id: "py06",
    name: "หมูหยองอย่างดี (หมูล้วน) แบบลัง",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam inventore est officiis quibusdam deleniti assumenda.",
    price: 7950,
    image: [p_img6, p_img00, p_img01],  
    category: "Pork",
    subCategory: "Carton",
    sizes: ["16.2kg"],
    date: new Date('2024-07-10T08:00:00').getTime(),
    bestseller: true
  }
]
