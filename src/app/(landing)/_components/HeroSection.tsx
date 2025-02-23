import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <>
      <div className="relative isolate pt-14">
        {/* Hero Background Image */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
          <Image
            src="/images/stories-background.jpeg"
            alt="Background illustration of storybooks"
            fill
            priority
            className="object-cover opacity-15"
          />
        </div>

        {/* Wave SVG Divider */}
        <div className="absolute inset-x-0 bottom-0 -z-[1] w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#913aee"
              fillOpacity="1"
              d="M0,256L18.5,224C36.9,192,74,128,111,106.7C147.7,85,185,107,222,133.3C258.5,160,295,192,332,224C369.2,256,406,288,443,272C480,256,517,192,554,160C590.8,128,628,128,665,133.3C701.5,139,738,149,775,170.7C812.3,192,849,224,886,213.3C923.1,203,960,149,997,154.7C1033.8,160,1071,224,1108,213.3C1144.6,203,1182,117,1218,85.3C1255.4,53,1292,75,1329,106.7C1366.2,139,1403,181,1422,202.7L1440,224L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative flex items-center gap-x-1.5 rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                <span>Now with AI Story Generation</span>
                <Sparkles className="h-4 w-4 text-brand-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Create Magical Stories with{" "}
              <span className="text-brand-primary">AI-Powered</span>{" "}
              Storytelling
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Transform your ideas into beautiful storybooks in minutes. Perfect
              for authors, educators, and parents who want to create engaging
              stories with custom characters and AI-generated illustrations.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/register" className="gap-x-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {/* <Button size="lg" variant="outline" asChild>
                <Link href="/#examples">See Examples</Link>
              </Button> */}
            </div>
            <div className="mt-8 flex items-center justify-center gap-x-8">
              <div className="flex items-center gap-x-2">
                <Zap className="h-5 w-5 text-brand-primary" />
                <span className="text-sm text-gray-600">
                  No credit card required
                </span>
              </div>
              <div className="flex items-center gap-x-2">
                <Sparkles className="h-5 w-5 text-brand-primary" />
                <span className="text-sm text-gray-600">
                  5 free stories per month
                </span>
              </div>
            </div>
          </div>

          {/* Preview Image - Now positioned above the wave */}
          <div className="relative mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/images/tool.png"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="relative z-10 rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#913aee"
            fillOpacity="1"
            d="M0,96L6.2,122.7C12.3,149,25,203,37,229.3C49.2,256,62,256,74,234.7C86.2,213,98,171,111,138.7C123.1,107,135,85,148,85.3C160,85,172,107,185,133.3C196.9,160,209,192,222,181.3C233.8,171,246,117,258,85.3C270.8,53,283,43,295,58.7C307.7,75,320,117,332,133.3C344.6,149,357,139,369,112C381.5,85,394,43,406,32C418.5,21,431,43,443,74.7C455.4,107,468,149,480,160C492.3,171,505,149,517,144C529.2,139,542,149,554,144C566.2,139,578,117,591,128C603.1,139,615,181,628,202.7C640,224,652,224,665,224C676.9,224,689,224,702,224C713.8,224,726,224,738,213.3C750.8,203,763,181,775,154.7C787.7,128,800,96,812,106.7C824.6,117,837,171,849,170.7C861.5,171,874,117,886,112C898.5,107,911,149,923,144C935.4,139,948,85,960,74.7C972.3,64,985,96,997,138.7C1009.2,181,1022,235,1034,229.3C1046.2,224,1058,160,1071,165.3C1083.1,171,1095,245,1108,250.7C1120,256,1132,192,1145,181.3C1156.9,171,1169,213,1182,224C1193.8,235,1206,213,1218,181.3C1230.8,149,1243,107,1255,122.7C1267.7,139,1280,213,1292,229.3C1304.6,245,1317,203,1329,170.7C1341.5,139,1354,117,1366,90.7C1378.5,64,1391,32,1403,16C1415.4,0,1428,0,1434,0L1440,0L1440,0L1433.8,0C1427.7,0,1415,0,1403,0C1390.8,0,1378,0,1366,0C1353.8,0,1342,0,1329,0C1316.9,0,1305,0,1292,0C1280,0,1268,0,1255,0C1243.1,0,1231,0,1218,0C1206.2,0,1194,0,1182,0C1169.2,0,1157,0,1145,0C1132.3,0,1120,0,1108,0C1095.4,0,1083,0,1071,0C1058.5,0,1046,0,1034,0C1021.5,0,1009,0,997,0C984.6,0,972,0,960,0C947.7,0,935,0,923,0C910.8,0,898,0,886,0C873.8,0,862,0,849,0C836.9,0,825,0,812,0C800,0,788,0,775,0C763.1,0,751,0,738,0C726.2,0,714,0,702,0C689.2,0,677,0,665,0C652.3,0,640,0,628,0C615.4,0,603,0,591,0C578.5,0,566,0,554,0C541.5,0,529,0,517,0C504.6,0,492,0,480,0C467.7,0,455,0,443,0C430.8,0,418,0,406,0C393.8,0,382,0,369,0C356.9,0,345,0,332,0C320,0,308,0,295,0C283.1,0,271,0,258,0C246.2,0,234,0,222,0C209.2,0,197,0,185,0C172.3,0,160,0,148,0C135.4,0,123,0,111,0C98.5,0,86,0,74,0C61.5,0,49,0,37,0C24.6,0,12,0,6,0L0,0Z"
          ></path>
        </svg>
      </div>
    </>
  );
}
