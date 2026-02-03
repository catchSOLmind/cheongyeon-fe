import ImgTest01 from '@/assets/images/test/img_test_01.png';
import ImgTest02 from '@/assets/images/test/img_test_02.png';
import ImgTest03 from '@/assets/images/test/img_test_03.png';
import ImgTest04 from '@/assets/images/test/img_test_04.png';
import ImgTest05 from '@/assets/images/test/img_test_05.png';
import ImgTest06 from '@/assets/images/test/img_test_06.png';
import ImgTest07 from '@/assets/images/test/img_test_07.png';
import ImgTest08 from '@/assets/images/test/img_test_08.png';
import ImgTest09 from '@/assets/images/test/img_test_09.png';

// order 기준으로 이미지 매핑
export const TEST_QUESTION_IMAGES: Record<number, string> = {
  1: ImgTest01,
  2: ImgTest02,
  3: ImgTest03,
  4: ImgTest04,
  5: ImgTest05,
  6: ImgTest06,
  7: ImgTest07,
  8: ImgTest08,
  9: ImgTest09,
};

// 기본 이미지 (order가 없을 경우)
export const DEFAULT_TEST_IMAGE = ImgTest01;