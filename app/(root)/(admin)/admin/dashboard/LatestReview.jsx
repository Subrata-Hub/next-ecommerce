import { Avatar } from "@/components/ui/avatar";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvatarImage } from "@radix-ui/react-avatar";
import { IoStar } from "react-icons/io5";

const LatestReview = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Product</TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 20 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={imgPlaceholder.src} />
                </Avatar>
                <span className="line-clamp-1">
                  Lorem ipsum dolor sit amet.
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      <IoStar className="text-yellow-500" />
                    </span>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LatestReview;
