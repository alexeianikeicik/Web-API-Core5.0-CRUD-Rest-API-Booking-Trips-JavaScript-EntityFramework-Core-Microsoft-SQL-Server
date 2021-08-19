using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPICore5_0W.Models
{
    public partial class Order
    {
        public int Id { get; set; }
        public string Fio { get; set; }
        public int? IdTrip { get; set; }

        public virtual Trip IdTripNavigation { get; set; }
    }
}
