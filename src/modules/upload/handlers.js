export async function uploadImage(req, res) {
  req.multipart(handler, done);

  // TODO: Upload multiple images
  const uploadStream = this.cloudinary.uploader.upload_stream(
    (error, result) => {
      if (error) {
        res.status(422).send({ error: 'upload failed' });
        return;
      }

      res.send(result.secure_url);
    },
  );

  function handler(field, file) {
    if (field !== 'image') {
      res.status(422).send({ error: 'upload failed' });
      return;
    }

    file.pipe(uploadStream);
  }

  function done(err) {
    if (err) {
      res.status(422).send({ error: 'upload failed' });
      return;
    }

    console.log('upload completed');
  }
}
