import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
        
        <div className='text-2xl text-center pt-8 border-t'>
            <Title text2={'เกี่ยวกับเรา'}/>
        </div>

        <div className='my-10 flex flex-col md:flex-row gap-16'>
            <img className='w-full md:max-[450px]' src={assets.about_img} alt="" />
            <div className='flex flex-col justify-center gap-6 md:w-4/4 text-gray-600'>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit iste laboriosam, ratione et voluptatibus deserunt fugiat exercitationem! Similique, dolorem officiis. Laudantium voluptate delectus expedita nostrum?</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate illum harum accusamus sit quisquam cumque tempore aliquid dicta reprehenderit molestiae quis, architecto labore cum laudantium, quia modi dolorum error iure?</p>
                {/* <b className='text-gray-800'>Our Mission</b>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam molestias alias obcaecati. Doloribus veritatis aut dignissimos quidem, rerum eaque alias cumque incidunt tempora, pariatur recusandae neque doloremque nulla corporis vel.</p> */}
            </div>
        </div>

        {/* <div className='text-xl py-4'>
            <Title text1={'WHY'} text2={'CHOOSE US'}/>
        </div>

        <div className='flex flex-col md:flex-row text-sm mb-20'>
            <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
              <b>Quality Assurance</b>
              <p className='text-gray-600'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum voluptatum explicabo sed, eum nobis nostrum.</p>
            </div>
            <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
              <b>Convenience:</b>
              <p className='text-gray-600'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt suscipit corrupti enim asperiores atque dolore deleniti aperiam.</p>
            </div>
            <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
              <b>Exceptional Customer Service:</b>
              <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam ullam, deleniti natus odit atque voluptatem. Eligendi earum, error voluptatibus corporis omnis adipisci dignissimos iste, harum voluptatem molestiae debitis, impedit optio?</p>
            </div>
        </div> */}

        {/* <NewsletterBox /> */}

    </div>
  )
}

export default About