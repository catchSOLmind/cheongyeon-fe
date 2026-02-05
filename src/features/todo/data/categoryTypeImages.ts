import ImgStar from '@/assets/todo/category/img-category-star.svg';
import ImgBathroom from '@/assets/todo/category/img-category-bathroom.svg';
import ImgKitchen from '@/assets/todo/category/img-category-kitchen.svg';
import ImgLaundry from '@/assets/todo/category/img-category-laundry.svg';
import ImgBedroom from '@/assets/todo/category/img-category-bedroom.svg';
import ImgLiving from '@/assets/todo/category/img-category-livingroom.svg';
import ImgTrash from '@/assets/todo/category/img-category-trash.svg';
import ImgEtc from '@/assets/todo/category/img-category-etc.svg';
import type { CategoryType } from '../types/category.types';

interface Category {
  categoryType: CategoryType | ''; 
  name: string;
  image?: string;
}

export const categories: Category[] = [
  { categoryType: '', name: '즐겨찾기', image: ImgStar },           
  { categoryType: 'BATHROOM', name: '화장실', image: ImgBathroom },
  { categoryType: 'KITCHEN', name: '주방', image: ImgKitchen },
  { categoryType: 'LAUNDRY', name: '빨래', image: ImgLaundry },
  { categoryType: 'BEDROOM', name: '침실', image: ImgBedroom },
  { categoryType: 'LIVING', name: '거실', image: ImgLiving },
  { categoryType: 'TRASH', name: '쓰레기', image: ImgTrash },
  { categoryType: 'ETC', name: '기타', image: ImgEtc },
];