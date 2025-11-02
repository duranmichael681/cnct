import SideBar from "../../components/SideBar";
import UserPicture from "../../assets/istockphoto-1495088043-612x612.jpg";
import PostPicture from "../../assets/download.jfif";
import ChainIcon from "../../assets/455691.png";
import CommentIcon from "../../assets/comment_24dp_BLACK_FILL0_wght400_GRAD0_opsz24.svg";
import PopularEventImage from "../../assets/how-it-works.jpg";
export default function Home() {
  return (
    <div className="flex max-h-screen ">
      <SideBar />
      <div className="flex-grow bg-[var(--background)] h-screen flex ">
        <div className="p-8 text-black w-2/3">
          <h1 className="text-5xl font-semibold mb-4">CNCT</h1>
          <div className="mt-4 flex items-center gap-4">
            <img
              src={UserPicture}
              alt="User Picture"
              className="w-full max-w-[70px] aspect-square rounded-full object-cover"
            />
            <h2 className="text-xl font-semibold">Profile_Name</h2>
            <div className="bg-gray-500 h-12 w-0.25 mx-15  "></div>
            <h2 className="font-semibold text-xl"> DATE/TIME </h2>
          </div>
          <div className="relative w-full max-w-[765px] aspect-[765/268] my-5">
            <img
              src={PostPicture}
              alt="User Post"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="flex justify-start">
            <div className="mx-8 flex flex-row gap-10">
              <img
                src={ChainIcon}
                alt="Chain Icon"
                className="w-6 h-6 object-contain  "
              />
              <h2 className="font-semibold text-xl">20</h2>
              <img
                src={CommentIcon}
                alt="Chain Icon"
                className="w-6 h-6 object-contain"
              />
              <h2 className="font-semibold text-xl">20</h2>
            </div>
          </div>
        </div>
        <div className=" m-5 w-1/3 h-2/5 flex flex-col justify-start items-center border-l border-gray-500 mt-20">
          <h1 className="text-center text-[var(--primary)] font-semibold text-3xl">
            Popular this Week
          </h1>
          <div className="flex w-full ">
            <div className="w-1/3 flex">
              <img
                src={PopularEventImage}
                alt="Popular Event"
                className="ml-10 rounded-xl max-w-[175px] aspect-square object-cover mt-10"
              />
            </div>
            <div className="mt-10 w-2/3 flex-row items-center justify-center">
              <h2 className="text-[var(--primary)] font-semibold text-2xl">
                {" "}
                Event Title
              </h2>
              <div className="bg-gray-500 h-0.25 w-15 my-3" />
              <div className="w-3/5">
                <p className="text-[var(--primary-text)]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Pellentesque a mi placerat{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
