import PhotoBoom from '@/components/PhotoBoom';
import ProjectPageShell from '@/components/ProjectPageShell';
import AnimatedPage from '@/components/AnimatedPage';
import { photoboomMetadata } from '@/app/page';

// Customize these images with your own!
// Place your images in the public/images folder and update the paths below
const images = [
  {
    id: '1',
    src: '/images/image1.jpeg',
    alt: 'Photo 1',
  },
  {
    id: '2',
    src: '/images/image2.jpeg',
    alt: 'Photo 2',
  },
  {
    id: '3',
    src: '/images/image3.jpeg',
    alt: 'Photo 3',
  },
  {
    id: '4',
    src: '/images/image4.jpeg',
    alt: 'Photo 4',
  },
];

export default function PhotoBoomPage() {
  const description = (
    <>
      <p className="mb-2 sm:mb-3">
        A stack of photos. Click and they explode outward from the exact point you touched — each card landing with its own rotation and drift. Click again and they collapse back.
      </p>
    </>
  );

  return (
    <AnimatedPage variant="dramatic">
      <ProjectPageShell
        title={photoboomMetadata.title}
        date={photoboomMetadata.date}
        category="Interaction"
        description={description}
        backHref="/craft"
        backLabel="Craft"
        shareConfig={{
          title: photoboomMetadata.shareTitle,
          text: photoboomMetadata.shareText,
        }}
        extraSpacing={{ mobile: -48, desktop: -24 }}
      >
        <PhotoBoom images={images} />
      </ProjectPageShell>
    </AnimatedPage>
  );
}








