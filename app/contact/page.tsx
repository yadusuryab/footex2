import { Connect } from '@/components/sections/contact';
import { site } from '@/lib/site-config';
import Link from 'next/link';
import React from 'react';

function Page() {
  return (
    <div className='px-2 '>
    <Connect/>
    <div className="p-4  rounded-lg shadow-md">
  <h2 className="text-xl font-bold  mb-2">You may contact us using the information below:
  </h2>
  <p>Merchant Legal entity name: MOHAMMED HASIF SUBIN HASIF</p>
  <p>Registered Address: tvm, kerala, trivandrum, Kerala, PIN: 605038</p>
  <p>Operational Address: tvm, kerala, trivandrum, Kerala, PIN: 605038</p>
  <p>
    📧 Mail:{" "}
    <Link href={`mailto:${site.email}`} className=" hover:underline">
      {site.email}
    </Link>
  </p>
  <p>
    📞 Phone:{" "}
    <Link href={`tel:${site.phone}`} className=" hover:underline">
      {site.phone}
    </Link>
  </p>
  <p>
    💬 WhatsApp:{" "}
    <Link
      href={`https://wa.me/${site.phone}`}
      className=" hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      Chat on WhatsApp
    </Link>
  </p>
  <p>
    📸 Instagram:{" "}
    <Link
      href={`https://instagram.com/${site.instagram}`}
      className=" hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      @{site.instagram}
    </Link>
  </p>
</div>

    </div>
  );
}

export default Page;