import { Image } from "@nextui-org/react";


export default function Home() {
  return (
<div>
<Image
                shadow="sm"
                radius="lg"
                width="100%"
                height="100%"
                alt={"Startseite"}
                className="w-full pt-5"
                src={"/images/startseite.png"}
              />
</div>
  )
}
