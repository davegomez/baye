import ref from 'ssb-ref';
import { visit } from 'unist-util-visit';
import toUrl from 'ssb-serve-blobs/id-to-url';

const BLOB_REF = '&AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=.sha256';

const imagesToSsbServeBlobs = () => (ast: any) => {
  visit(ast, 'image', (image) => {
    if (
      image.url &&
      typeof image.url === 'string' &&
      ref.isBlob(image.url.substr(0, BLOB_REF.length))
    ) {
      image.url = toUrl(image.url);
    }

    return image;
  });

  return ast;
};

export default imagesToSsbServeBlobs;
