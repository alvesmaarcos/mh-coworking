import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const bucketName = process.env.AWS_BUCKET_NAME;

        const jsonCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: "data/salas.json",
        });

        const jsonResponse = await s3Client.send(jsonCommand);
        const jsonString = await jsonResponse.Body.transformToString();
        const salas = JSON.parse(jsonString);

        const salasComUrls = await Promise.all(
            salas.map(async (sala) => {
                const s3Prefix = `s3://${bucketName}/`;
                const imageKey = sala.img.replace(s3Prefix, "");

                const imgCommand = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: imageKey,
                });

                const signedUrl = await getSignedUrl(s3Client, imgCommand, { expiresIn: 3600 });

                return {
                    ...sala,
                    img: signedUrl,
                };
            })
        );

        res.status(200).json(salasComUrls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno ao processar a requisição" });
    }
}