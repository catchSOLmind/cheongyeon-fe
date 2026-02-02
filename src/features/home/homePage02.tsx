import HomeBg2 from '@/assets/home/img-home-02.png';

function HomePage02() {
  return (
    <div
    className="min-h-screen w-full bg-no-repeat bg-top"
    style={{
        backgroundImage: `url(${HomeBg2})`,
        backgroundSize: '100% auto',
      }}
    >
    </div>
  );
}

export default HomePage02;
