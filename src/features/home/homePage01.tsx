import HomeBg from '@/assets/home/img-home-01.png';

function HomePage01() {
  return (
    <div
    className="min-h-screen w-full bg-no-repeat bg-top"
    style={{
        backgroundImage: `url(${HomeBg})`,
        backgroundSize: '100% auto',
      }}
    >
    </div>
  );
}

export default HomePage01;
