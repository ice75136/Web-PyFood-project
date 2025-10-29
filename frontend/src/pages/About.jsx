import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'


const About = () => {
    return (
        <div>

            <div className='text-2xl text-center pt-8 border-t border-gray-300'>
                <Title text2={'เกี่ยวกับเรา'} />
            </div>

            {/* --- 1. ส่วนเรื่องราวของเรา (Our Story) --- */}
            <div className='my-10 flex flex-col md:flex-row gap-16 items-center'>
                <img className='w-full md:max-w-[450px] rounded-lg' src={assets.about_img} alt="เกี่ยวกับ PY Food" />
                <div className='flex flex-col justify-center gap-6 md:w-4/4 text-gray-600'>
                    <div className='text-2xl text-center pt-8'>
                        <Title text2={'เกี่ยวกับแบรนด์โอชา'} />
                    </div>
                    <p>
                        แบรนด์“โอชา” ก่อตั้งเมื่อวันที่ 17 มิถุนายน พ.ศ. 2542 ในชื่อ บริษัท พี.วาย.ฟู้ด จำกัด เพื่อดำเนินธุรกิจผู้ผลิตและจำหน่ายอาหารแปรรูปจากเนื้อสัตว์
                        โรงงานตั้งอยู่ในซอยเทศบาลบางปู 59 จังหวัดสมุทรปราการ บนเนื้อที่ประมาณ 13 ไร่ พร้อมสภาพแวดล้อมที่ดี โดยจุดเริ่มต้นธุรกิจนั้นมาจาก จากรูปแบบครอบครัวระยะเวลากว่า 30 ปี
                        จากนั้นธุรกิจก้าวเติบโตขึ้นอย่าง ต่อเนื่องจนเป็นที่ยอมรับจากผู้บริโภคโดยทั่วไป จึงได้เริ่มตั้งแบรนด์ “โอชา”
                        ความหมายครอบคลุมเรื่องความอร่อย โดย คุณพยุงศักดิ์ แซ่ลิ้ม ตำแหน่งเจ้าหน้าที่บริหาร ณ ปัจจุบันมีพนักงาน กว่า 350 คน บริษัทฯ
                        เดินหน้าพัฒนาด้านกระบวนการผลิตอย่างต่อเนื่อง ซึ่ง มีเครื่องจักรทันสมัยในทุกขั้นตอนการผลิต โปรดักส์ในเครือ
                        เน้นถูกหลัก อนามัย สะอาด อร่อย สด ใหม่เสมอ เฉกเช่นสโลแกน “อร่อยทุกที่...ที่มีโอชา”
                    </p>
                    <p>
                        ผู้บริโภคสามารถไว้วางใจ แบรนด์ โอชา เนื่องจากได้รับรองมาตรฐาน โรงงานและผลิตภัณฑ์นั้น จากกรมวิทยาศาสตร์การแพทย์ และ คณะกรรมการอาหารและยาได้ออกใบรับรอง อ.ย.
                        การวางแผน การตลาดบริษัทมีผลิตภัณฑ์ออกสู่ตลาด ประกอบด้วย หมูหยอง, ไก่หยอง , น้ำพริกหมูหยอง, น้ำพริกเผา, น้ำพริกเผาต้มยำ, ไส้กรอก, ชิ้นส่วนไก่, ครีมเทียมข้นหวานชนิด
                        พร่องไขมัน, เครื่องดื่มชูกำลัง นอกจากนี้บริษัทฯ ยังได้รับการตรวจสอบประเมินผลตามประกาศจาก กระทรวงสาธารณสุข (ฉบับที่ 193) พ.ศ.2543 ในเรื่องวิธีการผลิต เครื่องมือเครื่องใช้ในการผลิตและ
                        การเก็บรักษาอาหาร ประกาศกระทรวงสาธารณสุข (ฉบับที่ 220) พ.ศ. 2544 เรื่องน้ำบริโภคในภาชนะ บรรจุที่ปิดสนิท (ฉบับที่ 3) เมื่อวันที่ 5 เมษายน พ.ศ.2547 ตามลำดับ และผลิตภัณฑ์ทางบริษัทฯ
                        ได้รับโอกาสเข้าร่วมโครงการยกระดับสถานที่ผลิตอาหาร อาหาร ปลอดภัย ของกระทรวงสาธารณสุข Food Safety จ.สมุทรปราการ และได้รับรางวัลอาหารดีเด่นปี 2546 ครั้งที่ 6 รางวัลอาหารดีเยี่ยมปี 2546
                        ครั้งที่ 5 รางวัลประกอบกิจการอาหารมาตรฐานและเข้า ร่วมโครงการเทคโนโลยีการผลิตที่สะอาด อุตสาหกรรมรายสาขาแปรรูปจากเนื้อสัตว์อีกด้วย
                    </p>
                </div>
            </div>

            <div className='my-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center'>
                {/* คอลัมน์ซ้าย: รูปภาพ (ต้องเพิ่มรูปใน assets ชื่อ founder_img) */}
                <img className='w-full md:max-w-[450px] rounded-lg mx-auto' src={assets.boss} alt="คุณพยุงศักดิ์ แซ่ลิ้ม" />

                {/* คอลัมน์ขวา: เนื้อหา */}
                <div className='flex flex-col justify-center gap-4 text-gray-600'>
                    <h2 className='text-3xl font-semibold text-red-700'>ผู้บริหารและผู้ก่อตั้ง <br/> แบรนด์โอชา</h2>
                    <h3 className='text-2xl font-medium'>คุณพยุงศักดิ์ แซ่ลิ้ม</h3>
                    <p className='text-lg font-semibold text-gray-700'>ประธานเจ้าหน้าที่บริหาร</p>
                    <p className='leading-relaxed'>
                        บริหารงานพร้อมคิดค้นสูตรผลิตภัณฑ์แบรนด์โอชาในเครือทั้งหมด ยึดคติประจำใจในการ
                        ขับเคลื่อนการทำงาน ลำดับแรก ความจริงใจต่อผู้บริโภค ให้ความสำคัญด้านคุณภาพ
                        วัตถุดิบเกรดพรีเมี่ยม หัวใจหลักด้านการผลิตเครื่องจักรสินค้าต้อง ได้มาตรฐานระดับ
                        สากล และซื่อสัตย์ต่อลูกค้าทุกคน สิ่งเหล่านี้จะทำให้ลูกค้ามั่นใจได้ว่าสินค้าภายใต้แ
                        บรนด์โอชา สมราคา คุ้มค่า คุณภาพเลิศ ปลอดภัย ยึดมั่นมาตลอดระยะเวลา 30 ปี
                    </p>
                </div>
            </div>

            {/* --- 2. ส่วนใหม่: วิสัยทัศน์ และ นโยบาย --- */}
            <div className='my-20 p-8 rounded-lg'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>

                    {/* คอลัมน์ซ้าย: วิสัยทัศน์ (จัดกึ่งกลางและจำกัดความกว้าง) */}
                    <div className='flex flex-col items-center text-center'>
                        <h2 className='text-3xl font-semibold mb-4 text-red-700'>วิสัยทัศน์</h2>
                        <p className='text-gray-600 leading-relaxed max-w-lg'>
                            แบรนด์โอชา มุ่งมั่นและตั้งใจการผลิตและมุ่งพัฒนาอาหารที่มีคุณภาพสูงและ
                            ปลอดภัยด้วยมาตรฐานอุตสาหกรรมที่ทันสมัยเพื่อสร้างเสริมคุณภาพชีวิตที่ดีแก่ผู้บริโภคทุกทุกคน
                            แตกต่าง ง่าย และล้ำสมัยด้านนวัตกรรม เทคโนโลยี
                        </p>
                    </div>

                    {/* คอลัมน์ขวา: นโยบายบริษัทฯ (จัด Layout ตามรูป) */}
                    <div className='flex flex-col items-center text-center md:items-start md:text-left'>
                        <h2 className='text-3xl font-semibold mb-4 text-red-700'>นโยบายบริษัทฯ</h2>
                        <div className='flex flex-col space-y-2 text-gray-600 leading-relaxed'>
                            <div className='flex flex-col sm:flex-row'>
                                <span className='w-48 flex-shrink-0 font-medium'>มุ่งมั่นสร้างสรรค์</span>
                                <span>ใส่ใจคุณภาพและบริการให้เป็นเลิศ</span>
                            </div>
                            <div className='flex flex-col sm:flex-row'>
                                <span className='w-48 flex-shrink-0 font-medium'>พร้อมสู่มาตรฐานสากล</span>
                                <span>พัฒนาบุคคลให้ก้าวไกล</span>
                            </div>
                            <div className='flex flex-col sm:flex-row'>
                                <span className='w-48 flex-shrink-0 font-medium'>เทคโนโลยีทันสมัย</span>
                                <span>ใส่ใจสิ่งแวดล้อม</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- 3. ส่วน ธุรกิจภายใต้แบรนด์โอชา (ชิดซ้าย) --- */}
            <div className='my-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center'>
                {/* คอลัมน์ซ้าย: เนื้อหา */}
                <div>
                    <h2 className='text-3xl font-semibold mb-4 text-red-700'>ธุรกิจภายใต้แบรนด์โอชา</h2>
                    <p className='text-gray-600 leading-relaxed'>
                        ความมุ่งมั่นเพื่อยกระดับคุณภาพการผลิตและสินค้าแบรนด์โอชา ในฐานะผู้ผลิตและจำหน่าย
                        อาหารแปรรูปจากเนื้อสัตว์ โดยมีผลิตภัณฑ์ ประกอบด้วย หมูหยอง, ไก่หยอง, น้ำพริกหมูหยอง,
                        น้ำพริกเผา, น้ำพริกเผาต้มยำ, ไส้กรอก, ชิ้นส่วนไก่, ครีมเทียมข้นหวานชนิดพร่องไขมัน, เครื่องดื่มชู
                        กำลัง เป็นต้น
                    </p>
                </div>
                {/* คอลัมน์ขวา: พื้นที่สำหรับใส่รูป */}
                <div className='w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500'>
                    <img src={assets.about_product} alt="ผลิตภัณฑ์โอชา" className='w-full h-full object-cover rounded-lg' />
                </div>
            </div>

            {/* --- 4. ส่วนทำไมต้องเลือกเรา (Why Choose Us) --- */}
            {/* <div className='my-20'>
                <div className='text-xl py-4 text-center'>
                    <Title text1={'ทำไมต้อง'} text2={'เลือกเรา'} />
                </div>

                <div className='flex flex-col md:flex-row text-sm text-center'>
                    
                    <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col items-center gap-5'>
                        <img src={assets.quality_icon} alt="คุณภาพ" className='w-16 h-16' />
                        <b className='text-lg'>วัตถุดิบคุณภาพ</b>
                        <p className='text-gray-600'>เราคัดสรรเนื้อสัตว์เกรด A และเครื่องปรุงอย่างดีที่สุด ปราศจากวัตถุกันเสีย</p>
                    </div>
                    
                    <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col items-center gap-5'>
                        <img src={assets.fresh_icon} alt="ความสดใหม่" className='w-16 h-16' />
                        <b className='text-lg'>สดใหม่ทุกวัน</b>
                        <p className='text-gray-600'>เราผลิตสินค้าใหม่ตามออเดอร์ ไม่มีการเก็บค้างสต็อก เพื่อให้คุณได้ลิ้มรสความสดใหม่อยู่เสมอ</p>
                    </div>
                    
                    <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col items-center gap-5'>
                        <img src={assets.clean_icon} alt="ความสะอาด" className='w-16 h-16' />
                        <b className='text-lg'>สะอาด ปลอดภัย</b>
                        <p className='text-gray-600'>ผ่านมาตรฐานการผลิต GMP และ อย. ทุกขั้นตอนการผลิตของเราสะอาดและมั่นใจได้</p>
                    </div>
                </div>
            </div> */}

            {/* --- 5. ส่วนกระบวนการผลิต (จัด Layout 2x2) --- */}
            <div className='my-20 p-8'>
                <div className='text-xl py-4 text-center mb-8'>
                    <Title text2={'กระบวนการผลิตของเรา'} />
                </div>
                
                {/* สร้าง Grid 4 คอลัมน์ */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
                    
                    {/* กระบวนการผลิตหมูหยอง */}
                    <div className='flex flex-col items-center text-gray-600'>
                        <h3 className='text-2xl font-semibold mb-4 text-red-700'>หมูหยอง</h3>
                        <ol className='list-decimal list-inside space-y-2 text-sm'>
                            <li>คัดสรรวัตถุดิบ ที่มีคุณภาพ</li>
                            <li>ผัดเนื้อหมูกับเครื่องปรุง (70-80°C, 2-3 ชม.)</li>
                            <li>ผึ่งเย็น (20-30°C, 15-20 นาที)</li>
                            <li>บรรจุใส่ถุง</li>
                            <li>ชั่งน้ำหนักกลับซีลปิดปากถุง</li>
                            <li>นำเข้าเครื่องตรวจจับโลหะ</li>
                            <li>จัดเก็บเข้าคลังสินค้า (อุณหภูมิห้อง)</li>
                            <li>จำหน่ายลูกค้าโดยรถปิดสนิท</li>
                        </ol>
                        <div className='mt-6 text-center font-semibold'>
                            <p>ยอดผลิต 5 ตัน/วัน</p>
                            <p>กำลังผลิตได้ 10 ตัน/วัน</p>
                        </div>
                    </div>

                    {/* กระบวนการแปรรูปเนื้อไก่ */}
                    <div className='flex flex-col items-center text-gray-600'>
                        <h3 className='text-2xl font-semibold mb-4 text-red-700'>เนื้อไก่</h3>
                        <ol className='list-decimal list-inside space-y-2 text-sm'>
                            <li>ไก่</li>
                            <li>ชั่งน้ำหนักไก่</li>
                            <li>แขวนไก่บนราว</li>
                            <li>เชือดไก่โดยพนักงาน อิสลาม</li>
                            <li>ลวกไก่ (65-70°C, 1 นาที)</li>
                            <li>ปั่นขน (25-30 ตัว/นาที)</li>
                            <li>ตัดขา+ตัดหัว</li>
                            <li>ล้วงเครื่องใน</li>
                            <li>ล้างผ่านอ่างชิลเลอร์ (0-4°C, 20 นาที)</li>
                            <li>แขวนไก่บนราว</li>
                            <li>ชำแหละชิ้นส่วน</li>
                            <li>แยกชิ้นส่วน</li>
                            <li>ชั่งน้ำหนัก</li>
                            <li>จัดเก็บเข้าห้องเย็น (0-4°C)</li>
                            <li>จำหน่ายลูกค้า (รถห้องเย็น)</li>
                        </ol>
                        <div className='mt-6 text-center font-semibold'>
                            <p>ยอดผลิต 10,000 ตัว/วัน</p>
                            <p>กำลังผลิตได้ 15,000 ตัว/วัน</p>
                        </div>
                    </div>

                    {/* กระบวนการผลิต ไส้กรอก */}
                    <div className='flex flex-col items-center text-gray-600'>
                        <h3 className='text-2xl font-semibold mb-4 text-red-700'>ไส้กรอก</h3>
                        <ol className='list-decimal list-inside space-y-2 text-sm'>
                            <li>คัดสรรวัตถุดิบ ที่มีคุณภาพ</li>
                            <li>นำวัตถุดิบมา mix รวมกัน</li>
                            <li>นำเข้าเครื่องอัด casing</li>
                            <li>เข้าตู้สไลม์</li>
                            <li>ลดอุณหภูมิ (30-35°C, 60 นาที)</li>
                            <li>เข้าเครื่องอัดไส้กรอก</li>
                            <li>บรรจุใส่ถุง</li>
                            <li>จับเก็บที่อุณหภูมิห้องเย็น (0-4°C)</li>
                            <li>จำหน่ายลูกค้า (รถห้องเย็น)</li>
                        </ol>
                        <div className='mt-6 text-center font-semibold'>
                            <p>ยอดผลิต 22 ตัน/วัน</p>
                            <p>กำลังผลิตได้ 30 ตัน/วัน</p>
                        </div>
                    </div>
                    
                    {/* กระบวนการผลิต น้ำพริก */}
                    <div className='flex flex-col items-center text-gray-600'>
                        <h3 className='text-2xl font-semibold mb-4 text-red-700'>น้ำพริก</h3>
                        <ol className='list-decimal list-inside space-y-2 text-sm'>
                            <li>คัดสรรวัตถุดิบ ที่มีคุณภาพ</li>
                            <li>นำวัตถุดิบมา mix รวมกัน</li>
                            <li>ออกมาเป็นเนื้อพริกแกง</li>
                            <li>ทำการผัด (100-120°C, 60-90 นาที)</li>
                            <li>พักให้ได้อุณหภูมิ (65-75°C, 30-40 นาที)</li>
                            <li>คัดน้ำพริกใส่ถังสแตนเลส</li>
                            <li>พักให้ได้อุณหภูมิ (37-45°C, 120-180 นาที)</li>
                            <li>บรรจุใส่ถุงชั่ง นน.ซีลปิดปากถุง</li>
                            <li>จัดเก็บเข้าคลังสินค้า (อุณหภูมิห้อง)</li>
                            <li>จำหน่ายลูกค้าโดยรถปิดสนิท</li>
                        </ol>
                        <div className='mt-6 text-center font-semibold'>
                            <p>ยอดผลิต 5 ตัน/วัน</p>
                            <p>กำลังผลิตได้ 12 ตัน/วัน</p>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* NewsletterBox ถูก comment ออกตามโค้ดเดิมของคุณ */}
            {/* <NewsletterBox /> */}

        </div>
    )
}

export default About