import { Avatar, Card, CardContent, Typography } from "@mui/material";

type JourneyMessageCardProps = {
  firstname: string;
  createdAt: Date;
  content: string;
  profilePicture?: string;
};

export default function JourneyMessageCard({
  firstname,
  createdAt,
  content,
  profilePicture,
}: JourneyMessageCardProps) {
  return (
    <Card className="flex items-start mb-4 p-4 shadow-sm">
      <Avatar className="mr-4" src={profilePicture}>
        {firstname}
      </Avatar>
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between">
          <Typography variant="h6" component="h6" className="font-semibold">
            {firstname}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="text-sm">
            {new Date(createdAt).toLocaleString()}
          </Typography>
        </div>
        <Typography
          variant="body1"
          className="mt-2 text-gray-700 whitespace-pre-wrap"
        >
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
}
