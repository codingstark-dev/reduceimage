import axios, { AxiosRequestConfig } from "axios";
import type { NextApiRequest, NextApiResponse } from 'next'
import { stringify } from "querystring";
import imgResize from './../../lib/image/image';
import img from "/pageid.png"
import formidable from "formidable"
// const formidable = require('formidable');
import sharp from "sharp"

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const form = new formidable.IncomingForm();

	const url = req.query.url;
	const title = req.query.title;
	const format = req.query.format;
	const color = req.query.color;
	const quality = req.query.quality;

	//! sizes
	const size = req.query.size;
	const width = req.query.width as unknown as number;
	const height = req.query.height as unknown as number;

	const mode = req.query.mode;
	const apikey = req.query.apikey;

	// console.log(url)
	// var options: AxiosRequestConfig = {
	//     url: url as string,
	//     method: "GET",
	//     responseType: "stream",

	// };
	// console.log(sharp.format);

	try {
		form.parse(req, async (err, fields, files) => {
			if (err) {
				return;
			}
			console.log(files.image['filepath']);
			const imageInput = files.image['filepath'];

			const contentType = files.image['mimetype'];
			// res.send(files);contentType[0].type
			console.log(color)
			await sharp(imageInput)
				.resize(width, height,)
				.toFormat(format === 'png' ? 'png' : format == "gif" ? 'gif' : "jpeg").flatten({ background: `${"#"+color}` })
				.toBuffer()
				.then((data) => {
					const base64Data = data.toString('base64');
					res.status(202).json({ b64Data: base64Data, contentType: contentType[0].type, extension: format === 'png' ? 'png' : format == "gif" ? 'gif' : "jpeg" });
					// res.send(base64Data);
				})
				.catch((err) => console.log(err));
		});

	} catch (error) {
		return res.status(500).json(error);
	}
}
export const config = {
	api: {
		bodyParser: false, externalResolver: true,

	},
};
