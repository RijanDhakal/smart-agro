interface Section {
  title: string;
  content: string[];
}

const subsidySections: Record<string, Section> = {
  introduction: {
    title: "Understanding Agricultural Subsidies in Nepal",
    content: [
      "Agricultural subsidies in Nepal are government-provided financial assistance programs designed to support farmers and promote agricultural productivity. These subsidies aim to make farming more economically viable and encourage sustainable agricultural practices.",
      "The Government of Nepal, through the Ministry of Agriculture and Livestock Development (MoALD), offers various subsidy schemes to help farmers reduce production costs, improve crop yields, and increase their income.",
      "Understanding these subsidies is crucial for every farmer in Nepal to maximize benefits and contribute to the nation's agricultural growth.",
    ],
  },
  fertilizer: {
    title: "Fertilizer Subsidies",
    content: [
      "The government provides subsidies on chemical fertilizers including urea, DAP (Diammonium Phosphate), and potash to help farmers reduce input costs. These subsidies typically cover 25-50% of the market price.",
      "Farmers can purchase subsidized fertilizers through Agriculture Input Companies (AICs) and cooperatives authorized by the government. Valid farmer identification and land ownership documents are required.",
      "The subsidy amount varies based on crop type and farm size. Priority is given to small-scale farmers and those in remote areas where transportation costs are higher.",
      "To access fertilizer subsidies, farmers must register with their local agricultural office and obtain a fertilizer distribution card (मल वितरण कार्ड).",
    ],
  },
  seeds: {
    title: "Quality Seed Subsidy Programs",
    content: [
      "The government subsidizes improved and certified seeds for major crops including rice, wheat, maize, lentils, and vegetables. Subsidies range from 50-75% on seed costs.",
      "National Seed Company and regional seed companies distribute subsidized seeds through Agriculture Service Centers and cooperatives across all 77 districts.",
      "Special seed subsidy packages are available for high-value crops like hybrid vegetables, oil seeds, and cash crops to promote commercial farming.",
      "Farmers participating in 'Prime Minister Agriculture Modernization Project' receive additional seed subsidies along with technical support and training.",
    ],
  },
  machinery: {
    title: "Farm Mechanization Subsidies",
    content: [
      "The government provides substantial subsidies (40-60%) on agricultural machinery including tractors, power tillers, harvesters, threshers, and irrigation equipment.",
      "Individual farmers can receive up to NPR 3 lakh subsidy on tractors and NPR 50,000 on power tillers. Farmer groups and cooperatives are eligible for higher subsidy amounts.",
      "Application process involves submitting proposals to the District Agriculture Development Office with details about land size, crop type, and machinery requirements.",
      "Women farmers and farmers from marginalized communities receive priority allocation and higher subsidy percentages under inclusive development programs.",
      "Subsidies also cover modern tools like sprayers, weeders, seed drills, and post-harvest processing equipment to improve efficiency throughout the farming cycle.",
    ],
  },
  irrigation: {
    title: "Irrigation Infrastructure Support",
    content: [
      "Subsidies are available for installing drip irrigation, sprinkler systems, and shallow tube wells. The government covers 60-80% of installation costs for small farmers.",
      "Group irrigation projects receive enhanced subsidies where communities collectively develop water storage, canal systems, and pump houses.",
      "Solar-powered irrigation pumps receive special subsidies of up to 90% to promote renewable energy use in agriculture and reduce dependence on fossil fuels.",
      "Technical support and training on efficient water management practices are provided alongside irrigation subsidies to maximize water use efficiency.",
    ],
  },
  livestock: {
    title: "Livestock and Poultry Subsidies",
    content: [
      "Farmers engaged in dairy farming can receive subsidies on improved cattle breeds, animal feed, vaccination programs, and artificial insemination services.",
      "Poultry farmers get subsidies on chick procurement, feed, housing infrastructure, and disease prevention measures. The subsidy covers 40-60% of initial setup costs.",
      "Goat and pig farming also receive government support with subsidies on breed improvement, housing, and veterinary services.",
      "Milk collection centers and cooperatives receive subsidies for establishing chilling plants and transportation facilities to ensure fair prices for dairy farmers.",
    ],
  },
  insurance: {
    title: "Agriculture Insurance Schemes",
    content: [
      "The government subsidizes crop insurance premiums to protect farmers against losses from natural disasters, pests, and diseases. Premium subsidies range from 70-75%.",
      "Livestock insurance is also subsidized to protect against animal death or disease. The scheme covers cattle, buffalo, goats, and poultry.",
      "Weather-based crop insurance schemes are being expanded to cover monsoon failure, drought, excess rainfall, and temperature extremes.",
      "Claims processing has been streamlined through digital platforms, making it easier for farmers to receive compensation quickly in case of crop failure.",
    ],
  },
  organic: {
    title: "Organic Farming Incentives",
    content: [
      "Special subsidies are provided for organic farming certification, organic inputs like bio-fertilizers, vermicompost units, and organic pest management solutions.",
      "Farmers converting from chemical to organic farming receive transition support subsidies for three years to compensate for initial yield reduction.",
      "Premium prices and guaranteed market linkages are arranged for organic produce through government procurement programs and organic bazaars.",
      "Training programs, field demonstrations, and expert visits are fully subsidized for farmers interested in organic farming practices.",
    ],
  },
  youthPrograms: {
    title: "Youth in Agriculture Programs",
    content: [
      "Young farmers (18-40 years) receive special subsidies and low-interest loans under the 'Youth Self-Employment Program' to encourage educated youth in commercial agriculture.",
      "Start-up grants of up to NPR 5 lakh are available for innovative agricultural enterprises, agri-tourism, food processing, and agricultural technology ventures.",
      "Free training, mentorship, and market linkage support are provided alongside financial subsidies to ensure successful agricultural entrepreneurship.",
      "Group farming initiatives by youth receive additional incentives and are given priority in accessing modern technology and export opportunities.",
    ],
  },
  application: {
    title: "How to Apply for Subsidies",
    content: [
      "Visit your local Agriculture Knowledge Center (कृषि ज्ञान केन्द्र) or District Agriculture Development Office to inquire about available subsidy schemes.",
      "Required documents typically include: citizenship certificate, land ownership certificate (लालपुर्जा), farmer identity card, and bank account details.",
      "Fill out the subsidy application form with details about your farming activities, land area, and the specific subsidy program you're applying for.",
      "Some subsidies require group applications through registered farmer cooperatives or producer groups, which can also provide additional benefits.",
      "Application deadlines vary by program, but most schemes accept applications during the fiscal year planning period (usually Ashar-Shrawan).",
      "Keep track of your application status through the MoALD online portal or by contacting your local agriculture office regularly.",
    ],
  },
  tips: {
    title: "Tips for Maximizing Subsidy Benefits",
    content: [
      "Register with local farmer groups and cooperatives as they often receive priority allocation and higher subsidy rates than individual farmers.",
      "Maintain proper farming records including crop areas, input usage, and production data as these may be required for subsidy verification.",
      "Attend agriculture training programs and workshops organized by local offices to stay informed about new subsidy schemes and application procedures.",
      "Ensure all your documents are updated and readily available. Missing or expired documents are the most common reason for subsidy application rejections.",
      "Consider combining multiple subsidy schemes - for example, you can apply for seed subsidies, fertilizer subsidies, and irrigation subsidies simultaneously for the same plot.",
      "Consult with agriculture extension officers who can provide guidance on which subsidies are most suitable for your farming situation and crop choices.",
    ],
  },
  contact: {
    title: "Contact and Support",
    content: [
      "For detailed information about agricultural subsidies, visit the Ministry of Agriculture and Livestock Development website at moald.gov.np",
      "Contact your nearest Agriculture Knowledge Center or dial the agriculture helpline at 1155 for queries about subsidy programs.",
      "District Agriculture Development Offices provide free counseling and assistance in preparing subsidy applications and connecting with farmer cooperatives.",
      "Join local farmer WhatsApp groups and social media communities where experienced farmers share information about subsidy announcements and application tips.",
    ],
  },
};

function Section({ title, content }: Section) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8">
        {title}
      </h2>
      <div className="space-y-4">
        {content.map((paragraph, index) => (
          <p
            key={index}
            className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
          >
            {paragraph.includes("moald.gov.np") ? (
              <>
                {paragraph.split(/(moald\.gov\.np)/).map((part, partIndex) => {
                  if (part === "moald.gov.np") {
                    return (
                      <a
                        key={partIndex}
                        href="https://moald.gov.np"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        moald.gov.np
                      </a>
                    );
                  }
                  return part;
                })}
              </>
            ) : (
              paragraph
            )}
          </p>
        ))}
      </div>
    </section>
  );
}

export default function FarmerSubsidiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {Object.values(subsidySections).map((section, index) => (
            <div key={index}>
              <Section {...section} />
            </div>
          ))}
        </article>
      </div>
    </div>
  );
}
