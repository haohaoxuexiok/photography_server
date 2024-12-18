const app = require("./src/app/index.js");
require("./src/app/database.js");

// const sharp = require("sharp");

// // 指定图片文件路径
// const imagePath = "./uploads/pictures/00d1b4ed7b3cf3a6ebea99a4ee9a3881";

// sharp(imagePath)
//   .metadata()
//   .then(({ width, height }) => {
//     console.log(`Width: ${width}, Height: ${height}`);
//   })
//   .catch((err) => {
//     console.error("Error reading image metadata:", err);
//   });


//,'192.168.0.194'

app.listen(8000, () => {
  console.log("服务器启动成功");
});

// const axios = require("axios");

//1.获取首页精选部分的内容
//const url = "https://www.skypixel.com/api/v2/pages/index?lang=zh-Hans&platform=web&device=desktop";
//2.获取轮播图部分的内容
//https://www.skypixel.com/api/v2/page-contents/skypixel_root_banner_top/banners?lang=zh-Hans&platform=web&device=desktop

//3.获取热门航拍点
//https://www.skypixel.com/api/v2/geo-tags?lang=zh-Hans&platform=web&device=desktop
//https://www.skypixel.com/api/v2/geo-tags/weight?lang=zh-Hans&platform=web&device=desktop
// async function getData() {
//const res = await axios.get("https://www.skypixel.com/api/v2/pages/index?lang=zh-Hans&platform=web&device=desktop");
//   {
//     "positiof n": 0,
//     "type": "works_tray",
//     "title": "自然",
//     "api": "/v2/topics/nature/works",
//     "params": {
//         "filter": "featured:true",
//         "sort": "hot"
//     },
//     "count": 16,
//     "redirect": {
//         "type": "topic_hot_works",
//         "slug": "nature"
//     }
// },
//const res = await axios.get("https://www.skypixel.com/api/v2/geo-tags/weight?lang=zh-Hans&platform=web&device=desktop");
//  {
//   "slug": "fb1d0808-cd37-493e-9c5e-24d53afe9f49",
//   "name": "澳大利亚",
//   "image": {
//       "small": "https://cdn-hz.skypixel.com/uploads/cn_files/1595408714645-cd3f5b9e6c1a4793a7e54d2455e2f379.jpg@!550",
//       "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/1595408714645-cd3f5b9e6c1a4793a7e54d2455e2f379.jpg@!1200",
//       "large": "https://cdn-hz.skypixel.com/uploads/cn_files/1595408714645-cd3f5b9e6c1a4793a7e54d2455e2f379.jpg@!1920"
//   },
//   "category": "region",
//   "lang": "zh-Hans",
//   "featured": true,
//   "longitude": "149.128070",
//   "latitude": "-35.283460",
//   "work_count": 19392
// },
//注 "/v2/topics/nature/works","/v2/topics/city/works"，"/v2/topics/sport/works",
//"/v2/topics/people/works","/v2/photographers/contract-works","/v2/tags",
//  const res = await axios.get("https://www.skypixel.com/api/v2/topics/nature/works?lang=zh-Hans&platform=web&device=desktop&filter=featured:true&sort=hot&limit=16&offset=0")
//  {
//   "type": "video",
//   "slug": "iceland-the-awakening-of-the-senses",
//   "title": "ICELAND The awakening of the senses",
//   "description": "This short film about Iceland was filmed during our family trip to this fascinating North Atlantic island in the summer of 2023.\n In Iceland, the climate is hostile, even in summer, but we were lucky to have a fairly mild climate, with hardly any rain and not excessively strong winds. This luck allowed us to fully enjoy this incredible place, which surprises in every corner you visit.\n\nWe were fortunate enough to witness a volcanic eruption during our visit to the island. The visit to the volcano was carefully scheduled to be able to see it up close, practically alone and without the noise of helicopters flying over, just the roars of the volcano, the flow of lava and the wind. I think he managed to capture and capture this experience on video.\n\nVolcanoes have always fascinated me, and I am grateful to have been able to enjoy such an impressive spectacle.\n We travel in a 4x4 camper through the highlands to Landmannalaugar, a truly magical place with colorful landscapes that contrast with the volcanic desert.\n\nI think Iceland may be the place on Earth that most resembles another planet. In this video, I was only able to insert fleeting moments so that everything fit together correctly. We will have the opportunity to enjoy it more calmly in a future video I make about Iceland. In addition, we will show images of the Vatnajökull glacier, which with a surface area of ​​8,100 km² is the largest glacier in Europe and one of the largest in the world. We will also see majestic waterfalls such as Skógafoss, Dettifoss and Haifoss, as well as canyons that look like something out of a fantasy movie. All this is mixed with a narrative constructed by my friend and writer Juanjo Villar Real. The voiceover was recorded by George Cate. The soundtrack was created by A Winged Victory for the Sullen and Bonnie Grace; I also contributed some sound elements to this soundtrack. The work on the soundtrack for this video was truly exceptional, which is why listening to the sound while enjoying these incredible images is crucial.\nThank you for visiting, I hope you enjoy \"Iceland\"",
//   "width": 3840,
//   "height": 2160,
//   "image": {
//       "small": "https://cdn-usa.skypixel.com/uploads/usa_files/video/image/52bd1613-dc1b-4299-a010-c7a66674b99e.jpg@!550",
//       "medium": "https://cdn-usa.skypixel.com/uploads/usa_files/video/image/52bd1613-dc1b-4299-a010-c7a66674b99e.jpg@!1200",
//       "large": "https://cdn-usa.skypixel.com/uploads/usa_files/video/image/52bd1613-dc1b-4299-a010-c7a66674b99e.jpg@!1920"
//   },
//   "tags": [
//       {
//           "slug": "iceland",
//           "name": "Iceland",
//           "image": {
//               "small": "https://cdn-hz.skypixel.com/uploads/cn_files/1557469918154-2979f94d25d4560bfc0de5d31fe32f28.jpg@!550",
//               "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/1557469918154-2979f94d25d4560bfc0de5d31fe32f28.jpg@!1200",
//               "large": "https://cdn-hz.skypixel.com/uploads/cn_files/1557469918154-2979f94d25d4560bfc0de5d31fe32f28.jpg@!1920"
//           },
//           "category": "region",
//           "lang": "en-US",
//           "featured": true,
//           "longitude": "-21.895410",
//           "latitude": "64.135480"
//       },
//       {
//           "slug": "dji-mavic-3-pro",
//           "name": "DJI Mavic 3 Pro",
//           "image": {
//               "small": "https://cdn-hz.skypixel.com/uploads/cn_files/1695788782201-a96007cfa1f8de433a62db59848d36b2.jpg@!550",
//               "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/1695788782201-a96007cfa1f8de433a62db59848d36b2.jpg@!1200",
//               "large": "https://cdn-hz.skypixel.com/uploads/cn_files/1695788782201-a96007cfa1f8de433a62db59848d36b2.jpg@!1920"
//           },
//           "category": "equipment",
//           "featured": true
//       },
//       {
//           "slug": "dji-mini-4-pro",
//           "name": "DJI Mini 4 Pro",
//           "image": {
//               "small": "https://cdn-hz.skypixel.com/uploads/cn_files/1695647101712-68c4d676136a2f6baf60528a6e192622.jpg@!550",
//               "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/1695647101712-68c4d676136a2f6baf60528a6e192622.jpg@!1200",
//               "large": "https://cdn-hz.skypixel.com/uploads/cn_files/1695647101712-68c4d676136a2f6baf60528a6e192622.jpg@!1920"
//           },
//           "category": "equipment",
//           "featured": true,
//           "is_activity_tag": true
//       },
//       {
//           "slug": "dji-air-3",
//           "name": "DJI Air 3",
//           "image": {
//               "small": "https://cdn-hz.skypixel.com/uploads/cn_files/1690285854436-d0fc151c7dec361e77a15e62be2fff91.jpg@!550",
//               "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/1690285854436-d0fc151c7dec361e77a15e62be2fff91.jpg@!1200",
//               "large": "https://cdn-hz.skypixel.com/uploads/cn_files/1690285854436-d0fc151c7dec361e77a15e62be2fff91.jpg@!1920"
//           },
//           "category": "equipment",
//           "featured": true,
//           "is_activity_tag": true
//       },
//       {
//           "slug": "dji-mavic-3",
//           "name": "DJI Mavic 3",
//           "image": {
//               "small": "https://cdn-hz.skypixel.com/uploads/cn_files/1644312249658-e2f199680c450e00150892e801136cef.jpg@!550",
//               "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/1644312249658-e2f199680c450e00150892e801136cef.jpg@!1200",
//               "large": "https://cdn-hz.skypixel.com/uploads/cn_files/1644312249658-e2f199680c450e00150892e801136cef.jpg@!1920"
//           },
//           "category": "equipment",
//           "featured": true,
//           "is_activity_tag": true
//       },
//       {
//           "slug": "mavic-air-2",
//           "name": "Mavic Air 2",
//           "image": {
//               "small": "https://cdn-hz.skypixel.com/uploads/cn_files/1588038093114-afac781cabf19ec7a709556cf7f10bc9.jpg@!550",
//               "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/1588038093114-afac781cabf19ec7a709556cf7f10bc9.jpg@!1200",
//               "large": "https://cdn-hz.skypixel.com/uploads/cn_files/1588038093114-afac781cabf19ec7a709556cf7f10bc9.jpg@!1920"
//           },
//           "featured": true,
//           "is_activity_tag": true
//       },
//       {
//           "slug": "dji-air2s-36f627e9-3b31-47a7-9cc4-9ae8bd61ab81",
//           "name": "dji Air2s,"
//       },
//       {
//           "slug": "islandia",
//           "name": "Islandia"
//       },
//       {
//           "slug": "short-cinematic",
//           "name": "Short Cinematic"
//       }
//   ],
//   "location": {
//       "label": "冰岛 · Northwestern Region",
//       "latitude": "64.963",
//       "longitude": "-19.021"
//   },
//   "equipment": {
//       "slug": "dji-air-s2",
//       "name": "DJI Air 2S",
//       "url": "https://store.dji.com/cn/product/dji-air-2s?utm_source=skypixel&utm_medium=banner&utm_campaign=launch-dji-air-2s"
//   },
//   "user": {
//       "slug": "djiuser-lbqeea5aowff",
//       "name": "DavidPardo71",
//       "avatar": {
//           "small": "https://cdn-usa.skypixel.com/uploads/usa_files/account/avatar_image/a32a6161-8759-4cd4-84a4-a9df1d7c1ef8.jpg@!64x64",
//           "medium": "https://cdn-usa.skypixel.com/uploads/usa_files/account/avatar_image/a32a6161-8759-4cd4-84a4-a9df1d7c1ef8.jpg@!128x128",
//           "large": "https://cdn-usa.skypixel.com/uploads/usa_files/account/avatar_image/a32a6161-8759-4cd4-84a4-a9df1d7c1ef8.jpg@!550"
//       },
//       "country_code": "ES",
//       "country_code3": "ESP",
//       "labels": [
//           "new_photographer"
//       ]
//   },
//   "visibility": "public",
//   "status": "accepted",
//   "view_count": 410,
//   "like_count": 17,
//   "featured": true,
//   "favorite_count": 5,
//   "comment_count": 6,
//   "badges": [
//       {
//           "name": "ordinary",
//           "image_name": "ordinary",
//           "description": "精选作品"
//       }
//   ],
//   "created_at": "2023-11-01T20:15:10Z",
//   "zone": "none",
//   "duration": 278,
//   "provider": "dji",
//   "play_url": "https://www.djivideos.com/video_play/a68afe92-8c98-4340-ab41-d54950c63176",
//   "cdn_url": {
//       "small": "https://us-videos.dji.net/video_trans/6f5263486e1643bbb605bf62c8657aa6/sd.mp4",
//       "medium": "https://us-videos.dji.net/video_trans/6f5263486e1643bbb605bf62c8657aa6/720.mp4",
//       "large": "https://us-videos.dji.net/video_trans/6f5263486e1643bbb605bf62c8657aa6/1080.mp4"
//   }
// },
//https://www.skypixel.com/api/v2/tags?lang=zh-Hans&platform=web&device=desktop&limit=24&offset=0
// {
//   "slug": "dji-mavic-3-pro",
//   "name": "DJI Mavic 3 Pro",
//   "image": {
//       "small": "https://cdn-hz.skypixel.com/uploads/cn_files/1695788782201-a96007cfa1f8de433a62db59848d36b2.jpg@!550",
//       "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/1695788782201-a96007cfa1f8de433a62db59848d36b2.jpg@!1200",
//       "large": "https://cdn-hz.skypixel.com/uploads/cn_files/1695788782201-a96007cfa1f8de433a62db59848d36b2.jpg@!1920"
//   },
//   "category": "equipment",
//   "featured": true
// },
//获取标签的内容
//https://www.skypixel.com/api/v2/tag-groups/theme?lang=zh-Hans&platform=web&device=desktop&limit=9&offset=27
// {
//   "slug": "ce54dae1-b245-48c4-b6a2-9206f6841c22",
//   "name": "旅行",
//   "resources": [
//       {
//           "slug": "kilauea",
//           "image": {
//               "small": "https://cdn-usa.skypixel.com/uploads/usa_files/photo/image/a411d10e-9f73-419e-a0ba-adda25c84998.jpg@!550",
//               "medium": "https://cdn-usa.skypixel.com/uploads/usa_files/photo/image/a411d10e-9f73-419e-a0ba-adda25c84998.jpg@!1200",
//               "large": "https://cdn-usa.skypixel.com/uploads/usa_files/photo/image/a411d10e-9f73-419e-a0ba-adda25c84998.jpg@!1920"
//           },
//           "type": "photo"
//       },
//       {
//           "slug": "cdf5e997-e100-4910-8b81-b5c331760835",
//           "image": {
//               "small": "https://cdn-hz.skypixel.com/uploads/cn_files/photo/image/83df981b-351f-47fd-b298-eff05c873443.jpg@!550",
//               "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/photo/image/83df981b-351f-47fd-b298-eff05c873443.jpg@!1200",
//               "large": "https://cdn-hz.skypixel.com/uploads/cn_files/photo/image/83df981b-351f-47fd-b298-eff05c873443.jpg@!1920"
//           },
//           "type": "photo"
//       },
//获取标签里面对应的内容
// https://www.skypixel.com/api/v2/tags/ce54dae1-b245-48c4-b6a2-9206f6841c22/works?lang=zh-Hans&platform=web&device=desktop&sort=popular&cycle=30d&limit=15&offset=0
// {
//   "type": "video",
//   "slug": "787b0549-6589-4915-95f6-03e5d8dfb60d",
//   "title": "《仲夏新疆》",
//   "description": "两个人，二十天，用一次新疆旅行为自己的学生生涯划上句号",
//   "width": 4096,
//   "height": 2048,
//   "image": {
//       "small": "https://cdn-hz.skypixel.com/uploads/cn_files/video/image/67ef30fc-322d-41e9-a6cc-6b834e5c16e4.png@!550",
//       "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/video/image/67ef30fc-322d-41e9-a6cc-6b834e5c16e4.png@!1200",
//       "large": "https://cdn-hz.skypixel.com/uploads/cn_files/video/image/67ef30fc-322d-41e9-a6cc-6b834e5c16e4.png@!1920"
//   },
//   "tags": [
//       {
//           "slug": "983e14ef-7a9f-4fc3-b05b-acaaed6ddf9d",
//           "name": "新疆",
//           "image": {
//               "small": "https://cdn-hz.skypixel.com/uploads/cn_files/1566287779807-78b2a7ae08bc016229823ca255238d0d.jpg@!550",
//               "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/1566287779807-78b2a7ae08bc016229823ca255238d0d.jpg@!1200",
//               "large": "https://cdn-hz.skypixel.com/uploads/cn_files/1566287779807-78b2a7ae08bc016229823ca255238d0d.jpg@!1920"
//           },
//           "category": "region",
//           "lang": "zh-Hans",
//           "featured": true,
//           "longitude": "87.624851",
//           "latitude": "43.830252"
//       },
//       {
//           "slug": "dji-mavic-3",
//           "name": "DJI Mavic 3",
//           "image": {
//               "small": "https://cdn-hz.skypixel.com/uploads/cn_files/1644312249658-e2f199680c450e00150892e801136cef.jpg@!550",
//               "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/1644312249658-e2f199680c450e00150892e801136cef.jpg@!1200",
//               "large": "https://cdn-hz.skypixel.com/uploads/cn_files/1644312249658-e2f199680c450e00150892e801136cef.jpg@!1920"
//           },
//           "category": "equipment",
//           "featured": true,
//           "is_activity_tag": true
//       },
//       {
//           "slug": "b4201acf-8dcb-41e7-90d1-c8ef950699de",
//           "name": "夏日色彩",
//           "image": {
//               "small": "https://cdn-hz.skypixel.com/uploads/cn_files/1685366352944-25c61bdd867b4e80a477cce5ad8a7928.jpg@!550",
//               "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/1685366352944-25c61bdd867b4e80a477cce5ad8a7928.jpg@!1200",
//               "large": "https://cdn-hz.skypixel.com/uploads/cn_files/1685366352944-25c61bdd867b4e80a477cce5ad8a7928.jpg@!1920"
//           },
//           "category": "theme",
//           "lang": "zh-Hans",
//           "featured": true,
//           "is_activity_tag": true
//       },
//       {
//           "slug": "ce54dae1-b245-48c4-b6a2-9206f6841c22",
//           "name": "旅行",
//           "image": {
//               "small": "https://cdn-usa.skypixel.com/uploads/usa_files/photo/image/21536122-9203-49b5-975f-b0426ef08ce3.jpeg@!550",
//               "medium": "https://cdn-usa.skypixel.com/uploads/usa_files/photo/image/21536122-9203-49b5-975f-b0426ef08ce3.jpeg@!1200",
//               "large": "https://cdn-usa.skypixel.com/uploads/usa_files/photo/image/21536122-9203-49b5-975f-b0426ef08ce3.jpeg@!1920"
//           },
//           "category": "theme",
//           "lang": "zh-Hans",
//           "featured": true
//       },
//       {
//           "slug": "0203827b-3279-4171-9e33-bd9afa0c6f09",
//           "name": "大美新疆"
//       },
//       {
//           "slug": "b0dfec78-ff38-4581-8f1b-aace02916317",
//           "name": "伊犁"
//       }
//   ],
//   "equipment": {
//       "slug": "dji-mavic-3",
//       "name": "DJI Mavic 3",
//       "url": "https://store.dji.com/product/dji-mavic-3?utm_source=skypixel&utm_medium=banner&utm_campaign=launch-mavic3"
//   },
//   "user": {
//       "slug": "djiuser-y5z0rqvkpnjy",
//       "name": "universe阿星",
//       "avatar": {
//           "small": "https://cdn-hz.skypixel.com/uploads/cn_files/account/avatar_image/2a4a7276-77ed-4702-85e9-515e70b3fe95.jpg@!64x64",
//           "medium": "https://cdn-hz.skypixel.com/uploads/cn_files/account/avatar_image/2a4a7276-77ed-4702-85e9-515e70b3fe95.jpg@!128x128",
//           "large": "https://cdn-hz.skypixel.com/uploads/cn_files/account/avatar_image/2a4a7276-77ed-4702-85e9-515e70b3fe95.jpg@!550"
//       },
//       "country_code": "CN",
//       "country_code3": "CHN",
//       "labels": [
//           "hot_photographer"
//       ]
//   },
//   "visibility": "public",
//   "status": "accepted",
//   "view_count": 1636,
//   "like_count": 56,
//   "featured": true,
//   "favorite_count": 24,
//   "comment_count": 4,
//   "badges": [
//       {
//           "name": "ordinary",
//           "image_name": "ordinary",
//           "description": "精选作品"
//       },
//       {
//           "name": "popular-work",
//           "image_name": "bronze",
//           "description": "当月热度作品"
//       }
//   ],
//   "created_at": "2023-10-19T10:13:34Z",
//   "zone": "none",
//   "duration": 220,
//   "provider": "dji",
//   "play_url": "https://www.djivideos.com/video_play/c29caeaf-2e5b-4b2d-95da-d2c3205ae66e",
//   "cdn_url": {
//       "small": "https://cn-videos.dji.net/video_trans/6c63534fc60148fe9b9aa885fb0bf8ca/sd.mp4",
//       "medium": "https://cn-videos.dji.net/video_trans/6c63534fc60148fe9b9aa885fb0bf8ca/720.mp4",
//       "large": "https://cn-videos.dji.net/video_trans/6c63534fc60148fe9b9aa885fb0bf8ca/1080.mp4"
//   }
// },
//获取对应的评论
//https://www.skypixel.com/api/v2/videos/787b0549-6589-4915-95f6-03e5d8dfb60d/comments?lang=zh-Hans&platform=web&device=desktop&limit=10&offset=0
// {
//   "id": 978314,
//   "user": {
//       "slug": "c1d24a1",
//       "name": "老家伙",
//       "avatar": {
//           "small": "https://cdn-usa.skypixel.com/uploads/usa_files/default_images/default_avatar/89426334-fbc4-4bcb-95e2-4936e1669347.png@!64x64",
//           "medium": "https://cdn-usa.skypixel.com/uploads/usa_files/default_images/default_avatar/89426334-fbc4-4bcb-95e2-4936e1669347.png@!128x128",
//           "large": "https://cdn-usa.skypixel.com/uploads/usa_files/default_images/default_avatar/89426334-fbc4-4bcb-95e2-4936e1669347.png@!550"
//       },
//       "country_code": "CN",
//       "country_code3": "CHN",
//       "default_avatar": true
//   },
//   "content": "极致！！！！！！",
//   "like_count": 0,
//   "liked": false,
//   "created_at": "2023-11-04T12:07:50Z"
// },
//点击标签获取更多内容
//ce54dae1-b245-48c4-b6a2-9206f6841c22对应标签的slug
//https://www.skypixel.com/api/v2/tags/ce54dae1-b245-48c4-b6a2-9206f6841c22/works?lang=zh-Hans&platform=web&device=desktop&sort=popular&cycle=30d&limit=15&offset=45
//https://www.skypixel.com/api/v2/tags/ce54dae1-b245-48c4-b6a2-9206f6841c22/videos?lang=zh-Hans&platform=web&device=desktop&sort=popular&cycle=30d&limit=15&offset=0
//https://www.skypixel.com/api/v2/tags/ce54dae1-b245-48c4-b6a2-9206f6841c22/photos?lang=zh-Hans&platform=web&device=desktop&sort=popular&cycle=30d&limit=15&offset=0
//https://www.skypixel.com/api/v2/tags/ce54dae1-b245-48c4-b6a2-9206f6841c22/photo-360s?lang=zh-Hans&platform=web&device=desktop&sort=popular&cycle=30d&limit=15&offset=0
//https://www.skypixel.com/api/v2/tags/ce54dae1-b245-48c4-b6a2-9206f6841c22/works?lang=zh-Hans&platform=web&device=desktop&sort=hot&limit=15&offset=0
//https://www.skypixel.com/api/v2/tags/ce54dae1-b245-48c4-b6a2-9206f6841c22/works?lang=zh-Hans&platform=web&device=desktop&sort=popular&cycle=all&limit=15&offset=0
//https://www.skypixel.com/api/v2/tags/ce54dae1-b245-48c4-b6a2-9206f6841c22/works?lang=zh-Hans&platform=web&device=desktop&sort=latest&limit=15&offset=15
//https://www.skypixel.com/api/v2/tags/ce54dae1-b245-48c4-b6a2-9206f6841c22/works?lang=zh-Hans&platform=web&device=desktop&sort=popular&cycle=30d&limit=15&offset=75

//获取对应的摄影师
//1.推荐摄影师 2.热门摄影师 3.新晋摄影师 4.签约摄影师
//https://www.skypixel.com/api/v2/photographers/recommended?user_type=&lang=zh-Hans&platform=web&device=desktop&limit=20&offset=0
//https://www.skypixel.com/api/v2/photographers/hot?user_type=&lang=zh-Hans&platform=web&device=desktop&limit=20&offset=0
//https://www.skypixel.com/api/v2/photographers/new?user_type=&lang=zh-Hans&platform=web&device=desktop&limit=20&offset=0
//https://www.skypixel.com/api/v2/photographers/contract?user_type=&lang=zh-Hans&platform=web&device=desktop&limit=20&offset=0

// }
// getData();
