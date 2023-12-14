import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, useMediaQuery } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import './SocialShare.css'
import food1 from '/assets/food1.jpeg'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
export default function SocialShare() {

    const cardData = [
        {
            title: 'Lizard 1',
            description:
                'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
            image:
                'https://img.freepik.com/free-psd/delicious-asian-food-social-media-template_505751-2960.jpg?w=826&t=st=1693914319~exp=1693914919~hmac=9598680f0fbf5abb5e66e467a31d703cdb2d81d19c73328cf41e440583865416',
        },
        {
            title: 'Lizard 2',
            description:
                'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
            image:
                'https://img.freepik.com/premium-psd/social-media-food-banner-design-template_542084-112.jpg?w=826',
        },
        {
            title: 'Lizard 3',
            description:
                'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
            image:
                'https://img.freepik.com/premium-psd/food-sale-social-media-banner-design-template_542084-145.jpg?w=826',
        },
        {
            title: 'Lizard 4',
            description:
                'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
            image:
                'https://img.freepik.com/free-psd/food-menu-restaurant-social-media-banner-template_120329-1732.jpg?w=826&t=st=1693915151~exp=1693915751~hmac=0972b0906746bd35cf2cddfd4c589108df82956f6b279f858f4f68103d2b61fe',
        },
        {
            title: 'Lizard 5',
            description:
                'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
            image:
                'https://img.freepik.com/premium-psd/special-delicious-food-social-media-banner-post_501590-261.jpg?w=826',
        },
        {
            title: 'Lizard 5',
            description:
                'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
            image:
                'https://img.freepik.com/free-psd/delicous-asian-food-social-media-template_505751-2981.jpg?w=826&t=st=1693915204~exp=1693915804~hmac=9a0410513be4298bb12feb020136046b46ed0a18842e1da67e2dad877d958a1d',
        },
        {
            title: 'Lizard 5',
            description:
                'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
            image:
                'https://img.freepik.com/free-psd/delicous-asian-food-social-media-template_505751-2981.jpg?w=826&t=st=1693915204~exp=1693915804~hmac=9a0410513be4298bb12feb020136046b46ed0a18842e1da67e2dad877d958a1d',
        },
    ];


    const sharePhoto = (photoURLl,desc) => {    // Replace 'URL_OF_YOUR_PHOTO' with the actual URL of the photo you want to share.   
        const photoURL = photoURLl;
        const photoDescription = desc
        // Check if the Facebook SDK is initialized   
        if (window.FB) {
            window.FB.ui({ method: 'share', href: photoURL, quote: photoDescription, });
        } else {
            console.error('Facebook SDK not initialized.');
        }
    };


    const imageArray = [
//         'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
// 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
// 'https://wallpapers.com/images/hd/food-on-white-plate-7mnxsuqqhc1bnb5j.webp',
// 'https://wallpapercave.com/wp/wp2559551.jpg',
// 'https://wallpapercave.com/uwp/uwp3520315.jpeg',
'https://img.freepik.com/free-photo/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai_188544-13382.jpg?w=1480&t=st=1693976194~exp=1693976794~hmac=8edde9f0e77526b01df90f07edc039857b0b5fbd95135651d33bdf6d4b7d2789',
food1


        // Add more image URLs here if needed
      ];
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    return (

        <div style={{ height: '100vh', overflowY: 'auto' }}>
            <div>
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                >

{imageArray.map((imageUrl, index) => (
                  <SwiperSlide key={index}>
  <div className="slide-content">
    <div className="image-container">
      <img
        src={imageUrl}
        alt={`Image ${index + 1}`}
        className="fitImage"
      />
      <div className="text-overlay">
      <div className="sp-container">
	<div className="sp-content">

		{/* <h2 className="frame-1">AWESOME</h2>
		<h2 className="frame-2">TEXT ANIMATION EFFECT</h2>
		<h2 className="frame-3">BUILD WITH CSS3</h2>
		<h2 className="frame-4">TEST IT!</h2> */}
		<h2 className="frame-5">
			<span>FORK,</span>
			<span>FOOD,</span>
			<span>SHARE.</span>

		</h2>
		{/* <a className="sp-circle-link" href="https://nick.mkrtchyan.ga">by Nick</a> */}
	</div>
</div><br/>
<br/><br/>
        <span className="frameee" style={{color:'white'}}>Share images to social platform</span>
<p></p>
      </div>
    </div>
  </div>
</SwiperSlide>
))}
                    {/* <SwiperSlide>Slide 2</SwiperSlide>
                    <SwiperSlide>Slide 3</SwiperSlide>
                    <SwiperSlide>Slide 4</SwiperSlide>
                    <SwiperSlide>Slide 5</SwiperSlide>
                    <SwiperSlide>Slide 6</SwiperSlide>
                    <SwiperSlide>Slide 7</SwiperSlide>
                    <SwiperSlide>Slide 8</SwiperSlide>
                    <SwiperSlide>Slide 9</SwiperSlide> */}
                </Swiper>
            </div>
            <div>

            <div className='new' style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '4rem', width: '80%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'grey', backgroundColor: 'grey' }}>
              
                <div style={{display:'contents'}}>
                <div>
                <h1 className='shareText'>You can share post to social media from here</h1>
                <svg width="12%" height="100%" style={{marginTop:'2rem'}} viewBox="0 0 78 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5.25939C27 -0.240624 53.5 -0.2406 77 4.25939" stroke="#F15700" ></path></svg>
                </div>
                <div>
                <img className="sc-eDLJxc hETPAk" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1002,h_600/v1678428358/portal/m/seo_web/dweb_header.png" width="512" height="300" alt="food"/>
                    
                </div>
                  
                </div>
              
                </div>
            </div>
            <div className='seperator'></div>
            <h1 style={{ display: 'flex',float:'', justifyContent: 'center', alignContent: 'center', alignItems: 'center', color: 'grey', fontSize: '45px', marginTop: '6rem' }}>
                {/* Welcome to image section */}
            </h1>
            {/* <div  className='new'></div> */}
            <Grid container spacing={isSmallScreen ? 2 : 4} style={{width:'82%',marginLeft:'8%'}}>
                {cardData.map((card, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
                        <div style={{ marginBottom: '20px' }}>
                            <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    component="img"
                                    alt="green iguana"
                                    height="140"
                                    image={card.image}
                                    style={{ width: '100%', height: '300px' }} // Set width and height here
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        onClick={() => sharePhoto(card.image,card.description)} // Pass the image URL to the sharePhoto function
                                    >
                                        <FacebookIcon />
                                        Share
                                    </Button>
                                </CardActions>
                            </Card></div>
                    </Grid>
                ))}
            </Grid>
            <br/>
   
            <div className='footer'>
<div style={{display:'flex',flexDirection:'row'}}>    <div style={{width:'50%'}}>
<h3 className='footerText'>For better experience,download the Restaurant management app now</h3>
    </div>
    <div style={{width:'50%',backgroundColor:'',display:'flex',flexDirection:'row',marginTop:'10px'}}>
    <img className='footer-img' src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/play_store.png"  alt="Download Android App"/>
    <img className="footer-img"  src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/app_store.png" alt="Download iOS App"/>
    </div>
</div>

            </div>
            <div style={{backgroundColor:'#33353d',width:'100%',height:'18vh'}}>
<h2 style={{color:'white',display:'flex',justifyContent:'center',alignContent:'center',alignItems:'center'}}>Restaurant Management System
</h2>
            </div>
        </div>
    )
}