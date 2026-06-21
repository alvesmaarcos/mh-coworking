import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
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
                const folderPrefix = imageKey.substring(0, imageKey.lastIndexOf('/') + 1);

                const listCommand = new ListObjectsV2Command({
                    Bucket: bucketName,
                    Prefix: folderPrefix,
                });

                const listData = await s3Client.send(listCommand);

                let galeriaUrls = [];
                if (listData.Contents) {
                    galeriaUrls = await Promise.all(
                        listData.Contents.map(async (item) => {
                            const imgCommand = new GetObjectCommand({
                                Bucket: bucketName,
                                Key: item.Key,
                            });
                            return await getSignedUrl(s3Client, imgCommand, { expiresIn: 3600 });
                        })
                    );
                }

                const coverCommand = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: imageKey,
                });
                const coverUrl = await getSignedUrl(s3Client, coverCommand, { expiresIn: 3600 });

                return {
                    ...sala,
                    img: coverUrl,
                    galeria: galeriaUrls,
                };
            })
        );

        res.status(200).json(salasComUrls);
    } catch (error) {
        res.status(500).json({ error: "Erro interno" });
    }
}