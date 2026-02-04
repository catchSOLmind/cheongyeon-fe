import ResultImage01 from '@/assets/test/img-result-01.png';
import ResultImage02 from '@/assets/test/img-result-02.png';
import ResultImage03 from '@/assets/test/img-result-03.png';
import ResultImage04 from '@/assets/test/img-result-04.png';

import ResultBg01 from '@/assets/test/img-test-bg-01.svg';
import ResultBg02 from '@/assets/test/img-test-bg-02.svg';
import ResultBg03 from '@/assets/test/img-test-bg-03.svg';
import ResultBg04 from '@/assets/test/img-test-bg-04.svg';

import ImgBubble from '@/assets/test/img-bubble.svg';

import type { ResultType } from '../types/test.types';

export type TopResultCardProps = {
  title: string;
  subTitle?: string;
  mainQuote?: string;
  resultType: ResultType;
};

const RESULT_IMAGES: Record<
  ResultType,
  { characterImg: string; background: string }
> = {
    //뽀득이
  PERFECTIONIST: {
    characterImg: ResultImage01,
    background: ResultBg01,
  },
  //느긋이
  RELAXED: {
    characterImg: ResultImage02,
    background: ResultBg02,
  },
  //효율이
  EFFICIENT: {
    characterImg: ResultImage03,
    background: ResultBg03,
  },
  //내일이 
  PROCRASTINATOR: {
    characterImg: ResultImage04,
    background: ResultBg04,
  },
};


export function TopResultCard(props: TopResultCardProps) {

    const { title, subTitle, mainQuote, resultType } = props;

    const { characterImg, background } = RESULT_IMAGES[resultType];

        return (
            <section className="flex justify-center">
                <div className="w-full max-w-[360px] rounded-[20px]">
                    {/* character header */}
                    <div
                    className="relative flex flex-col items-center rounded-2xl"
                    style={{
                        backgroundImage: `url(${background})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    >
                    {/* title / subtitle */}
                    {/* 산돌 폰트 적용되어야 하는 부분 */}
                    <div className="flex flex-col items-center py-6 pb-2">
                        <p className="text-[24px] font-bold text-gray-800 text-center">{title}</p>
                        <p className="text-body-l text-gray-800 text-center">{subTitle}</p>
                    </div>

                    {/* character image */}
                    <img
                        src={characterImg}
                        alt={title}
                        className="w-[228px] h-[196px] object-contain"
                    />

                    {/* quote bubble */}
                    <div className="relative -mt-6 w-full px-4">
                        {/* bubble image */}
                        <img
                            src={ImgBubble}
                            alt="quote bubble"
                            className="h-24 w-full object-fill z-10 py-3"
                            draggable={false}
                            />
                         {/* quote text */}
                        <div className="absolute inset-0 flex justify-center text-center text-[16px] text-gray-900">
                            <div className="flex h-full w-full items-center justify-center mt-1.5">
                            “{mainQuote}”
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
  );
}
