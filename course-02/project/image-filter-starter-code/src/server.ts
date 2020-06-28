import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get( "/filteredimage/", async ( req: Request, res: Response ) => {
    let { image_url } = req.query;

    if ( !image_url ) {
      return res.status(400).send(`parameter image_url is required`);
    }

    try {
      const filteredImagePath = await filterImageFromURL(image_url);

      return res.status(200)
          .sendFile(filteredImagePath, () => {deleteLocalFiles([filteredImagePath])});
    }
    catch (error) {
      return res.status(422).send(`image_url value is not valid`);
    }

  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();