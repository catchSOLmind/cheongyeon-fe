import Stamp01 from '@/assets/todo/feedback/icon-stemp-01.svg';
import Stamp02 from '@/assets/todo/feedback/icon-stemp-02.svg';
import Stamp03 from '@/assets/todo/feedback/icon-stemp-03.svg';
import Stamp04 from '@/assets/todo/feedback/icon-stemp-04.svg';
import Stamp05 from '@/assets/todo/feedback/icon-stemp-05.svg';
import Stamp06 from '@/assets/todo/feedback/icon-stemp-06.svg';
import Stamp01Fill from '@/assets/todo/feedback/icon-stemp-01-fill.svg';
import Stamp02Fill from '@/assets/todo/feedback/icon-stemp-02-fill.svg';
import Stamp03Fill from '@/assets/todo/feedback/icon-stemp-03-fill.svg';
import Stamp04Fill from '@/assets/todo/feedback/icon-stemp-04-fill.svg';
import Stamp05Fill from '@/assets/todo/feedback/icon-stemp-05-fill.svg';
import Stamp06Fill from '@/assets/todo/feedback/icon-stemp-06-fill.svg';

interface ComplimentSticker {
    id: string;
    title: string;
    description: string;
    icon: string;
    iconFill: string;
  }
  
export const complimentStickers: ComplimentSticker[] = [
    { id: '1', title: '꼼꼼왕', description: '꼼꼼하게\n잘 해요', icon: Stamp01, iconFill: Stamp01Fill },
    { id: '2', title: '시간엄수', description: '시간을\n잘 지켜요', icon: Stamp02, iconFill: Stamp02Fill },
    { id: '3', title: '먼지킬러', description: '먼지 하나\n 없어요', icon: Stamp03, iconFill: Stamp03Fill },
    { id: '4', title: '향기왕', description: '향기까지\n 신경써요', icon: Stamp04, iconFill: Stamp04Fill },
    { id: '5', title: '포인트왕', description: '업무를 \n많이 했어요', icon: Stamp05, iconFill: Stamp05Fill },
    { id: '6', title: '정리정돈', description: '정리정돈 \n완벽', icon: Stamp06, iconFill: Stamp06Fill },
  ];