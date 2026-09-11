export interface CustomerGreeting {
  salutation: string;
  timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  weatherContext: string;
  suggestedCategories: string[];
}

export function generateSmartGreeting(
  firstName: string,
  currentHour = new Date().getHours(),
  temperatureC = 22,
): CustomerGreeting {
  let timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT' = 'MORNING';
  let salutation = `Good morning, ${firstName}!`;
  let suggestedCategories = ['AC Deep Cleaning', 'Plumbing Inspection', 'Car Wash'];

  if (currentHour >= 12 && currentHour < 17) {
    timeOfDay = 'AFTERNOON';
    salutation = `Good afternoon, ${firstName}!`;
    suggestedCategories = ['Home Cleaning', 'Appliance Repair', 'Gardening'];
  } else if (currentHour >= 17 && currentHour < 22) {
    timeOfDay = 'EVENING';
    salutation = `Good evening, ${firstName}!`;
    suggestedCategories = ['Pest Control', 'Handyman Services', 'Electrical Maintenance'];
  } else if (currentHour >= 22 || currentHour < 5) {
    timeOfDay = 'NIGHT';
    salutation = `Hello, ${firstName}!`;
    suggestedCategories = ['Emergency Plumbing', '24/7 Locksmith', 'Emergency Electrical'];
  }

  let weatherContext = 'Sunny and warm today';
  if (temperatureC > 30) {
    weatherContext = 'Hot outside — stay cool with AC Servicing';
  } else if (temperatureC < 15) {
    weatherContext = 'Chilly weather — water heater maintenance recommended';
  }

  return {
    salutation,
    timeOfDay,
    weatherContext,
    suggestedCategories,
  };
}
